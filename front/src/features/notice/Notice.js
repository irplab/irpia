import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import debounce from 'lodash.debounce';
import 'react-dropdown-tree-select/dist/styles.css'
import {initSuggestion, pollSuggestionById, selectSuggestions,} from './suggestionsSlice';
import './Notice.module.css';
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchVocabularyById, selectVocabularies} from "./vocabulariesSlice";
import {SuggestionComponent} from "./SuggestionComponent";
import {
    Box,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {useTheme} from "@mui/styles";
import DropdownTreeSelect from "react-dropdown-tree-select";

export function Notice() {
    const theme = useTheme();
    const suggestions = useSelector(selectSuggestions);
    const vocabularies = useSelector(selectVocabularies);
    const dispatch = useDispatch();
    const [notice, setNotice] = useState({title: '', description: '', url: ''});
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

    const debouncedChangeHandler = useMemo(() => debounce(handleSubmittedNoticeChange, 1500), []);

    const handleUserInputChange = (field) => {
        setNotice({...notice, ...field});
        debouncedChangeHandler(field)
    };
    const handleUserSelectionChange = (field) => {
        setNotice({...notice, ...field});
        handleSubmittedNoticeChange(field)
    };

    const isValueExcluded = useCallback((field, value) => {
        return excludedValues[field] && excludedValues[field].indexOf(value) >= 0;
    }, [excludedValues]);

    const currentSuggestion = useMemo(() => suggestions.entities[suggestionId], [suggestions, suggestionId])

    const formIsEmpty = useMemo(() => Object.values(submittedNotice).every(x => (x === null || x === undefined || x === '' || x?.length == 0)), [submittedNotice])

    useEffect(() => {
        if (formIsEmpty) {
            return;
        }
        dispatch(initSuggestion(submittedNotice)).then(unwrapResult).then((data) => {
            setSuggestionId(data.id)
            data.status === "running" && setPollingFlag(!pollingFlag)
        }).catch((error) => {
            console.log(error)
        });
    }, [submittedNotice, dispatch])

    useEffect(() => {
        dispatch(fetchVocabularyById({vocabularyId: '10'}))
        dispatch(fetchVocabularyById({vocabularyId: '15GTPX', hierarchy: true}))
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

    const domainsTree = useMemo(() => {
        return <DropdownTreeSelect
            data={getVocabularyTerms('15GTPX')}
            className="mdl-demo"
            keepTreeOnSearch
            showPartiallySelected
            inlineSearchInput
            inlineSearchPlaceholder={"Domaine d'enseignement"}
            texts={{
                placeholder: "Domaine d'enseignement",              // optional: The text to display as placeholder on the search box. Defaults to `Choose...`
                inlineSearchPlaceholder: "Taper quelques lettres",  // optional: The text to display as placeholder on the inline search box. Only applicable with the `inlineSearchInput` setting. Defaults to `Search...`
                noMatches: "Aucune correspondance",                // optional: The text to display when the search does not find results in the content list. Defaults to `No matches found`
                label: "Dom",                    // optional: Adds `aria-labelledby` to search input when input starts with `#`, adds `aria-label` to search input when label has value (not containing '#')
                labelRemove: "Domdom",              // optional: The text to display for `aria-label` on tag delete buttons which is combined with `aria-labelledby` pointing to the node label. Defaults to `Remove`
            }}

        />
    }, [vocabularies])

    const statusText = useMemo(() => {
        const running = currentSuggestion?.status === 'running'
        let text = 'Irpia attend'
        let color = 'teal'
        if (running) {
            text = `Irpia réfléchit ${currentSuggestion?.terminated} / ${currentSuggestion?.total}`
            color = 'sky'
        }
        return (
            <Paper p={5} xs={{margin: theme.spacing(5)}} elevation={4}>
                <Box p={2}>
                    <Typography fontSize='medium'>
                        {text}
                    </Typography>
                    {
                        running && <LinearProgress/>
                    }
                </Box>
            </Paper>)
    }, [suggestions])

    return (<>
            {statusText}
            <form className="w-full mt-5" onSubmit={e => {
                e.preventDefault();
            }}>
                <TextField
                    margin='normal' fullWidth
                    id="outlined-adornment-url"
                    aria-describedby="outlined-url-helper-text"
                    inputProps={{
                        'aria-label': 'url',
                    }}
                    label='URL'
                    id="grid-url"
                    value={notice.url}
                    onChange={(e) => handleUserInputChange({url: e.target.value})}
                />
                <TextField margin='normal' fullWidth id="grid-title"
                           label="Titre"
                           variant="outlined"
                           placeholder="Titre de votre ressource"
                           onChange={(e) => handleUserInputChange({title: e.target.value})}/>
                {currentSuggestion && <SuggestionComponent
                    field='title' suggestions={currentSuggestion.suggestions?.title}
                    acceptCallback={(value) => handleUserSelectionChange({title: value})}/>}
                <TextField margin='normal' fullWidth id="grid-title" label="Description" variant="outlined"
                           multiline
                           placeholder="Description de votre ressource"
                           value={notice.description}
                           onChange={(e) => handleUserInputChange({description: e.target.value})}/>
                {currentSuggestion && <SuggestionComponent
                    field='description'
                    suggestions={currentSuggestion.suggestions?.description}
                    acceptCallback={(value) => handleUserSelectionChange({description: value})}/>}
                <FormControl fullWidth margin='normal'>
                    <InputLabel id="educational-resource-type-select-label"> Type de ressource</InputLabel>
                    <Select
                        labelId="educational-resource-type-select-label"
                        id="educational-resource-type-select"
                        label='Type de ressource'
                        onChange={(e) => handleUserSelectionChange({educationalResourceType: e.target.value})}
                        value={notice.educationalResourceType}
                    >
                        <MenuItem>Choisissez un type de ressource</MenuItem>
                        {Object.entries(getVocabularyTerms(10)).map((entry) => (
                            <MenuItem key={`option-educational-resource-type-${entry[0]}`}
                                      value={entry[0]}>{entry[1]}</MenuItem>
                        ))}
                    </Select>
                    {currentSuggestion && currentSuggestion.suggestions?.educationalResourceType && <SuggestionComponent
                        field='domain'
                        suggestions={currentSuggestion.suggestions.educationalResourceType?.filter((x) => x !== notice.domain && !isValueExcluded('educationalResourceType', x))}
                        titleProvider={id => getVocabularyTerms('10')[id]}
                        rejectCallback={(value) => dispatchExcludedValues({field: 'educationalResourceType', value: value})}
                        acceptCallback={(value) => handleUserSelectionChange({educationalResourceType: value})}
                    />}
                </FormControl>

                <FormControl fullWidth margin='normal'>
                    {domainsTree}
                    {currentSuggestion && currentSuggestion.suggestions?.domain && <SuggestionComponent
                        field='domain'
                        suggestions={currentSuggestion.suggestions.domain?.filter((x) => x !== notice.domain && !isValueExcluded('domain', x))}
                        titleProvider={id => getVocabularyTerms('15GTPX')[id]}
                        rejectCallback={(value) => dispatchExcludedValues({field: 'domain', value: value})}
                        acceptCallback={(value) => handleUserSelectionChange({domain: value})}
                    />}
                </FormControl>

            </form>
        </>
    );
}
