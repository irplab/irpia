import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import debounce from 'lodash.debounce';
import {
    pollSuggestionById, initSuggestion, selectSuggestions,
} from './suggestionsSlice';
import styles from './Notice.module.css';
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchVocabularyById, selectVocabularies} from "./vocabulariesSlice";
import {SuggestionComponent} from "./SuggestionComponent";

export function Notice() {
    const suggestions = useSelector(selectSuggestions);
    const vocabularies = useSelector(selectVocabularies);
    const dispatch = useDispatch();
    const [notice, setNotice] = useState({title: ''});
    const [submittedNotice, setSubmittedNotice] = useState({title: ''});
    const [suggestionId, setSuggestionId] = useState(undefined);
    const [pollingFlag, setPollingFlag] = useState(false);

    const initiallyExcludedValues = {};

    function excludedValuesReducer(state, action) {
        if (action.field && action.value) {
            let newState = {...state};
            newState[action.field] = newState[action.field] || []
            if (newState[action.field].indexOf(action.value) === -1) {
                newState[action.field].push(action.value)
            }
            return newState
        } else {
            throw new Error("Domaine obligatoire");
        }
    }

    const [excludedValues, dispatchExcludedValues] = useReducer(excludedValuesReducer, initiallyExcludedValues);


    const handleSubmittedNoticeChange = (field) => {
        setSubmittedNotice({...submittedNotice, ...field});
    };

    const debouncedChangeHandler = useMemo(() => debounce(handleSubmittedNoticeChange, 300), []);

    const handleUserInputChange = (field) => {
        setNotice({...notice, ...field});
        debouncedChangeHandler(field)
    };

    const isValueExcluded = useCallback((field, value) => {
        return excludedValues[field] && excludedValues[field].indexOf(value) >= 0;
    }, [excludedValues]);

    const currentSuggestion = useMemo(() => suggestions.entities[suggestionId], [suggestions, suggestionId])

    useEffect(() => dispatch(initSuggestion(submittedNotice)).then(unwrapResult).then((data) => {
        setSuggestionId(data.id)
        data.status === "running" && setPollingFlag(!pollingFlag)
    }).catch((error) => {
        console.log(error)
    }), [submittedNotice, dispatch])

    useEffect(() => {
        dispatch(fetchVocabularyById('10'))
        dispatch(fetchVocabularyById('15GTPX'))
    }, [])


    const getVocabularyTerms = useCallback((vocId) => {
        if (!vocabularies.entities[vocId]) return []
        return vocabularies.entities[vocId].terms;
    }, [vocabularies])

    useEffect(() => {
        if (!suggestionId) return
        return dispatch(pollSuggestionById({
            suggestionId, suggestionTimeStamp: currentSuggestion?.updatedAt
        })).then(unwrapResult).then((data) => {
            if (data.id !== suggestionId) return;
            data.status === "running" && setPollingFlag(!pollingFlag)
        }).catch((error) => {
            console.log(error)
        });
    }, [dispatch, pollingFlag])

    const statusText = useMemo(() => {
        const running = currentSuggestion?.status === 'running'
        let text = 'Irpia attend'
        let color = 'teal'
        if (running) {
            text = `Irpia réfléchit ${currentSuggestion?.terminated} / ${currentSuggestion?.total}`
            color = 'sky'
        }
        return (
            <span className="flex h-3 w-auto mt-2">
                {running && <span
                    className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-10 w-auto p-2 bg-${color}-500`}>{text}</span>
        </span>)
    }, [suggestions])

    return (<div className='pt-36 pb-24 px-6'>
        <div className="flex flex-row justify-end">
            <div className="flex flex-col justify-end align-middle">
                {statusText}
            </div>
        </div>
        <form className="w-full mt-5" onSubmit={e => {
            e.preventDefault();
        }}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="grid-title">
                        Titre
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="grid-title" type="text"
                        value={notice.title}
                        onChange={(e) => handleUserInputChange({title: e.target.value})}/>
                    <p className="text-xs italic">Please fill out this field.</p>
                    {currentSuggestion && <SuggestionComponent
                        field='title' suggestions={currentSuggestion.suggestions?.title}
                        acceptCallback={(value) => handleUserInputChange({title: value})}/>}
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="grid-description">
                        description
                    </label>

                    <textarea
                        className="resize-y appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-description" placeholder="Description de votre ressource"
                        value={notice.description}
                        onChange={(e) => debouncedChangeHandler({description: e.target.value})}/>
                    <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                    {currentSuggestion && <SuggestionComponent
                        field='description'
                        suggestions={currentSuggestion.suggestions?.description}
                        acceptCallback={(value) => handleUserInputChange({description: value})}/>}
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="grid-state">
                        Type de ressource
                    </label>
                    <div className="relative">
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            onChange={(e) => handleUserInputChange({educationalResourceType: e.target.value})}
                            value={notice.educationalResourceType}
                            id="grid-state">
                            <option>Choisissez un type de ressource</option>
                            {Object.entries(getVocabularyTerms(10)).map((entry) => (
                                <option key={`option-educational-resource-type-${entry[0]}`}
                                        value={entry[0]}>{entry[1]}</option>
                            ))}

                        </select>
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="grid-state">
                        Domaine d'enseignement
                    </label>
                    <div className="relative mb-2">
                        <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            onChange={(e) => handleUserInputChange({educationalResourceType: e.target.value})}
                            value={notice.domain}
                            id="grid-state">
                            <option>Choisissez une discipline</option>
                            {Object.entries(getVocabularyTerms('15GTPX')).map((entry) => (
                                <option key={`option-domain-${entry[0]}`} value={entry[0]}>{entry[1]}</option>
                            ))}

                        </select>
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                    {currentSuggestion && currentSuggestion.suggestions?.domain && <SuggestionComponent
                        field='domain'
                        suggestions={currentSuggestion.suggestions?.domain?.filter((x) => x !== notice.domain && !isValueExcluded('domain', x))}
                        titleProvider={id => getVocabularyTerms('15GTPX')[id]}
                        rejectCallback={(value) => dispatchExcludedValues({field: 'domain', value: value})}
                        acceptCallback={(value) => handleUserInputChange({domain: value})}
                    />}
                </div>

            </div>
        </form>
    </div>)
        ;
}
