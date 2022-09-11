import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import debounce from 'lodash.debounce';
import 'react-dropdown-tree-select/dist/styles.css'
import {initSuggestion, pollSuggestionById, selectSuggestions,} from './suggestionsSlice';
import './notice.css'
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchVocabularyById, selectVocabularies} from "./vocabulariesSlice";
import {SuggestionComponent} from "./SuggestionComponent";
import Character from '../../graphics/personnage.svg';
import {
    CardMedia,
    Container,
    FormControl,
    FormHelperText,
    Grid, IconButton,
    lighten,
    Slide,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import DropdownTreeSelect from "react-dropdown-tree-select";
import {MultiSuggestionComponent} from "./MultiSuggestionComponent";
import OutlinedDiv from "../../commons/OutlinedDiv";
import {updateField} from "./noticeSlice";
import BouncingDotsLoader from "../../commons/BouncingDotsLoader";
import ClearIcon from "@mui/icons-material/Clear";

export function Notice() {
    const theme = useTheme();
    const suggestions = useSelector(selectSuggestions);
    const vocabularies = useSelector(selectVocabularies);
    const submittedNotice = useSelector((state) => state.notice.value);
    const dispatch = useDispatch();
    const [notice, setNotice] = useState(submittedNotice);
    const [suggestionId, setSuggestionId] = useState(undefined);
    const [displayedSggestionId, setDisplayedSuggestionId] = useState(undefined);
    const [pollingFlag, setPollingFlag] = useState(false);
    const [domainUpdateFlag, setDomainUpdateFlag] = useState(false);
    const [levelUpdateFlag, setLevelUpdateFlag] = useState(false);

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

    const [, dispatchExcludedValues] = useReducer(excludedValuesReducer, initiallyExcludedValues);


    const handleSubmittedNoticeChange = (field) => {
        dispatch(updateField(field));
    };

    const debouncedChangeHandler = useMemo(() => debounce(handleSubmittedNoticeChange, 1500), [handleSubmittedNoticeChange]);

    const handleUserInputChange = (field) => {
        setNotice({...notice, ...field});
        debouncedChangeHandler(field)
    };
    const handleUserSelectionChange = (field) => {
        setNotice({...notice, ...field});
        debouncedChangeHandler(field)
    };

    const isValueSelected = useCallback((field, value) => {
        return notice[field] && notice[field].indexOf(value) >= 0;
    }, [notice]);

    const currentSuggestion = useMemo(() => suggestions.entities[displayedSggestionId], [suggestions, displayedSggestionId])

    const formIsEmpty = useMemo(() => Object.values(submittedNotice).every(x => (x === null || x === undefined || x === '' || x?.length === 0)), [submittedNotice])

    useEffect(() => {
        if (formIsEmpty) {
            return;
        }
        dispatch(initSuggestion(submittedNotice)).then(unwrapResult).then((data) => {
            setSuggestionId(data.id);
            data.status === "running" && setPollingFlag(!pollingFlag)
        }).catch((error) => {
            console.log(error)
        });
    }, [submittedNotice, dispatch, formIsEmpty])

    useEffect(() => {
        dispatch(fetchVocabularyById({vocabularyId: '04'}))
        dispatch(fetchVocabularyById({vocabularyId: '10'}))
        dispatch(fetchVocabularyById({vocabularyId: '15GTPX'}))
        dispatch(fetchVocabularyById({vocabularyId: '15GTPX', hierarchy: true}))
        dispatch(fetchVocabularyById({vocabularyId: '22'}))
        dispatch(fetchVocabularyById({vocabularyId: '22', hierarchy: true}))
    }, [dispatch])


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
            if (displayedSggestionId !== suggestionId) setDisplayedSuggestionId(suggestionId);
            data.status === "running" && setPollingFlag(!pollingFlag)
        }).catch((error) => {
            console.log(error)
        });
    }, [dispatch, pollingFlag])

    const markSelected = (vocabulary, field) => {
        return (vocabulary || []).map((term) => {
            if (notice[field]?.indexOf(term.value.split("/").pop()) >= 0 || notice[field]?.indexOf(term.value) >= 0) {
                return {...term, checked: true, children: markSelected(term.children, field)};
            } else {
                return {...term, checked: false, children: markSelected(term.children, field)};
            }
        });
    };

    const domainsTree = useMemo(() => {
        return <DropdownTreeSelect
            data={markSelected(getVocabularyTerms('15GTPX-hierarchy'), 'domain')}
            className="mdl-demo"
            keepTreeOnSearch
            showPartiallySelected
            mode="hierarchical"
            inlineSearchInput
            inlineSearchPlaceholder={"Domaine d'enseignement"}
            texts={{
                placeholder: "Liste complète des domaines d'enseignement",              // optional: The text to display as placeholder on the search box. Defaults to `Choose...`
                inlineSearchPlaceholder: "Taper quelques lettres pour filtrer les domaines",  // optional: The text to display as placeholder on the inline search box. Only applicable with the `inlineSearchInput` setting. Defaults to `Search...`
                noMatches: "Aucune correspondance",                // optional: The text to display when the search does not find results in the content list. Defaults to `No matches found`
                label: "Dom",                    // optional: Adds `aria-labelledby` to search input when input starts with `#`, adds `aria-label` to search input when label has value (not containing '#')
                labelRemove: "Domdom",              // optional: The text to display for `aria-label` on tag delete buttons which is combined with `aria-labelledby` pointing to the node label. Defaults to `Remove`
            }}
            onChange={(currentNode, selectedNodes) => {
                handleUserSelectionChange({domain: selectedNodes.map((node) => node.value.split("/").pop())});
            }}

        />
    }, [vocabularies, domainUpdateFlag, getVocabularyTerms])

    const levelsTree = useMemo(() => {
        return <DropdownTreeSelect
            data={markSelected(getVocabularyTerms('22-hierarchy'), 'level')}
            className="mdl-demo"
            keepTreeOnSearch
            showPartiallySelected
            mode="hierarchical"
            inlineSearchInput
            inlineSearchPlaceholder={"Niveau éducatif"}
            texts={{
                placeholder: "Liste complète des niveaux éducatifs",              // optional: The text to display as placeholder on the search box. Defaults to `Choose...`
                inlineSearchPlaceholder: "Taper quelques lettres",  // optional: The text to display as placeholder on the inline search box. Only applicable with the `inlineSearchInput` setting. Defaults to `Search...`
                noMatches: "Aucune correspondance",                // optional: The text to display when the search does not find results in the content list. Defaults to `No matches found`
                label: "Dom",                    // optional: Adds `aria-labelledby` to search input when input starts with `#`, adds `aria-label` to search input when label has value (not containing '#')
                labelRemove: "Domdom",              // optional: The text to display for `aria-label` on tag delete buttons which is combined with `aria-labelledby` pointing to the node label. Defaults to `Remove`
            }}
            onChange={(currentNode, selectedNodes) => {
                handleUserSelectionChange({level: selectedNodes.map((node) => node.value.split("/").pop())});
            }}

        />
    }, [vocabularies, levelUpdateFlag, getVocabularyTerms])

    const statusText = useMemo(() => {
        const running = currentSuggestion?.status === 'running'
        let text = 'Irpia attend'
        if (running) {
            text = `Irpia réfléchit ${currentSuggestion?.terminated} / ${currentSuggestion?.total}`
        }
        return (
            <Slide direction="left" mountOnEnter unmountOnExit in={running}><Grid
                container
                width={200}
                direction="column" p={2}
                justifyContent="end"
                textAlign="center"
                position="fixed"
                sx={{
                    p: (theme) => theme.spacing(4),
                    zIndex: 'tooltip',
                    backgroundColor: (theme) => lighten(theme.palette.secondary.light, 0.7),
                    borderRadius: "50%",

                }} top='30%' right='30%'>
                <Grid item>
                    <Typography fontSize='medium' color={theme.palette.secondary.main} fontWeight='bold'>
                        {text}
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container direction="row" alignItems="center" justifyContent="end">
                        <Grid item sx={{alignContent: "center"}}
                              display="flex"
                              minHeight="80"
                        >
                            <CardMedia
                                component="img"
                                alt="IRPI logo"
                                src={Character}
                                sx={{
                                    width: 60,
                                    height: 100,
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }
                                }
                            /></Grid>
                        <Grid item>
                            <BouncingDotsLoader bouncing={running}/></Grid>
                    </Grid>
                </Grid>
            </Grid></Slide>)
    }, [suggestions])

    const flatVocabularyMenuEntries = (vocId) => Object.keys(getVocabularyTerms(vocId)).map(v => {
        return {value: v, label: getVocabularyTerms(vocId)[v]};
    });

    const sortmenuEntries = (a, b) => a.label.localeCompare(b.label);

    return (<Container><Grid container sx={{marginTop: theme.spacing(5)}} direction='column'>
            {statusText}
            <form onSubmit={e => {
                e.preventDefault();
            }}>
                <TextField
                    margin='normal' fullWidth
                    aria-describedby="outlined-url-helper-text"
                    inputProps={{
                        'aria-label': 'url',
                    }}
                    label='URL'
                    id="grid-url"
                    value={notice.url}
                    onChange={(e) => handleUserInputChange({url: e.target.value})}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                sx={{visibility: notice.url ? "visible" : "hidden"}}
                                onClick={() => handleUserInputChange({url: ''})}
                            >
                                <ClearIcon/>
                            </IconButton>
                        ),
                    }}
                />
                <TextField margin='normal' fullWidth id="grid-title"
                           label="Titre"
                           variant="outlined"
                           InputLabelProps={{shrink: !!notice.title}}
                           value={notice.title}
                           placeholder="Titre de votre ressource"
                           onChange={(e) => handleUserInputChange({title: e.target.value})}
                           InputProps={{
                               endAdornment: (
                                   <IconButton
                                       sx={{visibility: notice.title ? "visible" : "hidden"}}
                                       onClick={() => handleUserInputChange({title: ''})}
                                   >
                                       <ClearIcon/>
                                   </IconButton>
                               ),
                           }}/>
                {currentSuggestion && !notice.title && <SuggestionComponent
                    field='title'
                    suggestions={(currentSuggestion.suggestions?.title || []).filter((t) => t !== notice.title)}
                    acceptCallback={(value) => handleUserSelectionChange({title: value})}/>}
                <TextField margin='normal' fullWidth id="grid-title" label="Description" variant="outlined"
                           multiline
                           inputProps={{type: "search"}}
                           placeholder="Description de votre ressource"
                           InputLabelProps={{shrink: !!notice.description}}
                           value={notice.description}
                           onChange={(e) => handleUserInputChange({description: e.target.value})}
                           InputProps={{
                               endAdornment: (
                                   <IconButton
                                       sx={{visibility: notice.description ? "visible" : "hidden"}}
                                       onClick={() => handleUserInputChange({description: ''})}
                                   >
                                       <ClearIcon/>
                                   </IconButton>
                               ),
                           }}/>
                {currentSuggestion && <SuggestionComponent
                    field='description'
                    suggestions={(currentSuggestion.suggestions?.description || []).filter((t) => t !== notice.description)}
                    acceptCallback={(value) => handleUserSelectionChange({description: value})}/>}

                <FormControl fullWidth margin='normal'>
                    <OutlinedDiv label="Domaines d'enseignement">
                        <Grid container direction='column' id='domain-controls-container'
                              className="controls-container">
                            <Grid item>{domainsTree}</Grid>
                            <Grid item>
                                {currentSuggestion && currentSuggestion.suggestions?.domain && <MultiSuggestionComponent
                                    field='domain'
                                    suggestions={currentSuggestion.suggestions?.domain?.filter((x) => x !== notice.domain && !isValueSelected('domain', x))}
                                    titleProvider={id => getVocabularyTerms('15GTPX-flat')[id]}
                                    rejectCallback={(value) => dispatchExcludedValues({field: 'domain', value: value})}
                                    acceptCallback={(values) => {
                                        handleUserSelectionChange({domain: (notice.domain || []).concat(values)});
                                        setDomainUpdateFlag(!domainUpdateFlag);
                                    }}
                                />}</Grid>
                        </Grid>
                    </OutlinedDiv>
                </FormControl>

                <FormControl fullWidth margin='normal'>
                    <OutlinedDiv label="Niveaux educatifs">
                        <Grid container direction='column' id='level-controls-container' className="controls-container">
                            <Grid item>{levelsTree}</Grid>
                            <Grid item>
                                {currentSuggestion && currentSuggestion.suggestions?.level && <MultiSuggestionComponent
                                    field='level'
                                    suggestions={currentSuggestion.suggestions?.level?.filter((x) => x !== notice.domain && !isValueSelected('level', x))}
                                    titleProvider={id => getVocabularyTerms('22-flat')[id]}
                                    rejectCallback={(value) => dispatchExcludedValues({field: 'level', value: value})}
                                    acceptCallback={(values) => {
                                        handleUserSelectionChange({level: (notice.level || []).concat(values)});
                                        setLevelUpdateFlag(!levelUpdateFlag);
                                    }}
                                />}</Grid>
                        </Grid>
                    </OutlinedDiv>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <OutlinedDiv label="Type de ressource" sx={{width: "100%"}}>
                        <Grid container direction='column' id='type-controls-container'
                              className="controls-container"><Grid item>
                            <DropdownTreeSelect
                                sx={{width: "100%"}}
                                data={markSelected(flatVocabularyMenuEntries('04-flat').sort(sortmenuEntries), 'documentTypeId')}
                                className="mdl-demo"
                                mode="multiSelect"
                                inlineSearchInput
                                texts={{
                                    placeholder: "Type documentaire",
                                    inlineSearchPlaceholder: "Taper quelques lettres",
                                    noMatches: "Aucune correspondance",                // optional: The text to display when the search does not find results in the content list. Defaults to `No matches found`
                                    label: "Dom",                    // optional: Adds `aria-labelledby` to search input when input starts with `#`, adds `aria-label` to search input when label has value (not containing '#')
                                    labelRemove: "Domdom",              // optional: The text to display for `aria-label` on tag delete buttons which is combined with `aria-labelledby` pointing to the node label. Defaults to `Remove`
                                }}
                                onChange={(currentNode, selectedNodes) => {
                                    handleUserSelectionChange({
                                        documentTypeId: selectedNodes.map((node) => node.value),
                                        documentTypeLabel: selectedNodes.map((node) => node.label)
                                    });
                                }}

                            />
                            <FormHelperText>Lorem ipsum expliquer le sens de cette typologie</FormHelperText>
                        </Grid> <Grid item>
                            <DropdownTreeSelect
                                sx={{width: "100%"}}
                                data={markSelected(flatVocabularyMenuEntries('10-flat').sort(sortmenuEntries), 'educationalResourceTypeId')}
                                className="mdl-demo"
                                mode="multiSelect"
                                inlineSearchInput
                                texts={{
                                    placeholder: "Type pédagogique",
                                    inlineSearchPlaceholder: "Taper quelques lettres",
                                    noMatches: "Aucune correspondance",                // optional: The text to display when the search does not find results in the content list. Defaults to `No matches found`
                                    label: "Dom",                    // optional: Adds `aria-labelledby` to search input when input starts with `#`, adds `aria-label` to search input when label has value (not containing '#')
                                    labelRemove: "Domdom",              // optional: The text to display for `aria-label` on tag delete buttons which is combined with `aria-labelledby` pointing to the node label. Defaults to `Remove`
                                }}
                                onChange={(currentNode, selectedNodes) => {
                                    handleUserSelectionChange({
                                        educationalResourceTypeId: selectedNodes.map((node) => node.value),
                                        educationalResourceTypeLabel: selectedNodes.map((node) => node.label),

                                    });
                                }}

                            />
                            <FormHelperText>Lorem ipsum expliquer le sens de cette typologie</FormHelperText>
                        </Grid> <Grid item>
                            {currentSuggestion && currentSuggestion.suggestions?.educationalResourceType &&
                                <SuggestionComponent
                                    field='domain'
                                    suggestions={currentSuggestion.suggestions.educationalResourceType?.filter((x) => x !== notice.domain && !isValueSelected('educationalResourceType', x))}
                                    titleProvider={id => getVocabularyTerms('10')[id]}
                                    rejectCallback={(value) => dispatchExcludedValues({
                                        field: 'educationalResourceType',
                                        value: value
                                    })}
                                    acceptCallback={(value) => handleUserSelectionChange({educationalResourceType: value})}
                                />}
                        </Grid>
                        </Grid>
                    </OutlinedDiv>
                </FormControl>

            </form>
        </Grid>
        </Container>
    )
        ;
}
