import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import debounce from 'lodash.debounce';
import {
    pollSuggestionById, initSuggestion, selectSuggestions,
} from './suggestionsSlice';
import styles from './Notice.module.css';
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchVocabularyById, selectVocabularies} from "./vocabulariesSlice";

export function Notice() {
    const suggestions = useSelector(selectSuggestions);
    const vocabularies = useSelector(selectVocabularies);
    const dispatch = useDispatch();
    const [notice, setNotice] = useState({title: ''});
    const [suggestionId, setSuggestionId] = useState(undefined);
    const [pollingFlag, setPollingFlag] = useState(false);

    const handleUserInputChange = (field) => {
        setNotice({...notice, ...field});
    };

    const currentSuggestion = useMemo(() => suggestions.entities[suggestionId], [suggestions, suggestionId])

    useEffect(() => dispatch(initSuggestion(notice)).then(unwrapResult).then((data) => {
        setSuggestionId(data.id)
        data.status === "running" && setPollingFlag(!pollingFlag)
    }).catch((error) => {
        console.log(error)
    }), [notice, dispatch])

    useEffect(() => {
        console.log("redux -sugg");
        console.log(suggestions);
    }, [suggestions])

    useEffect(() => {
        console.log("redux - vocab");
        console.log(vocabularies);
    }, [vocabularies])

    useEffect(() => {
        dispatch(fetchVocabularyById(10))
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
            // console.log(error)
        });
    }, [dispatch, pollingFlag])

    const debouncedChangeHandler = useMemo(() => debounce(handleUserInputChange, 300), []);

    const statusText = useMemo(() => {
        const running = currentSuggestion?.status === 'running'
        let text = 'À l\'arrêt'
        let color = 'teal'
        if (running) {
            text = `En cours : reçu ${currentSuggestion?.terminated} / ${currentSuggestion?.total}`
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
                Moteur de suggestion : {statusText}
            </div>
        </div>
        <form className="w-full mt-5">
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="grid-title">
                        Titre
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="grid-title" type="text"
                        onChange={(e) => debouncedChangeHandler({title: e.target.value})}/>
                    <p className="text-xs italic">Please fill out this field.</p>
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
                        onChange={(e) => debouncedChangeHandler({description: e.target.value})}/>
                    <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
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
                            onChange={(e) => debouncedChangeHandler({educationalResourceType: e.target.value})}
                        id="grid-state">
                        {Object.entries(getVocabularyTerms(10)).map((entry) => (
                            <option value={entry[0]}>{entry[1]}</option>
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
</form>
</div>)
    ;
}
