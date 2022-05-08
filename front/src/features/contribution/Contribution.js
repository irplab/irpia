import React, {useEffect, useMemo, useState} from 'react';
import {Autocomplete, Box, Chip, Grid, Popper, Stack, TextField, Typography, useTheme} from "@mui/material";
import debounce from "lodash.debounce";
import {getContributors} from "../notice/contributionAPI";

const SIRENE_IDENTIFIER = "Sirène";

const ISNI_IDENTIFIER = "ISNI";

export function Contribution() {
    const theme = useTheme();
    const [openAutoComplete, setOpenAutoComplete] = useState(false);
    const [submittedName, setSubmittedName] = useState('');
    const [selectedSiren, setSelectedSiren] = useState(null);
    const [selectedIsni, setSelectedIsni] = useState(null);
    const [editorName, setEditorName] = useState('');
    const [editorialBrand, setEditorialBrand] = useState('');
    const [autocompleteIsLoading, setAutocompleteIsLoading] = useState(false);
    const [options, setOptions] = useState([])
    useEffect(() => {
        if (!submittedName) {
            setAutocompleteIsLoading(false);
            return;
        }
        getContributors(submittedName).then((result) => {
            setOptions(result.data);
        }).finally(() => {
            setAutocompleteIsLoading(false);
        })
    }, [submittedName])

    const handleSubmittedNameChange = (name) => {
        setAutocompleteIsLoading(true);
        setSubmittedName(name);
    };

    const debouncedChangeHandler = useMemo(() => debounce(handleSubmittedNameChange, 1500), []);
    const handleUserInputChange = (name) => {
        debouncedChangeHandler(name)
    };

    const optionChoosed = (event, newValues) => {
        const siren = newValues.filter((value) => value.source === SIRENE_IDENTIFIER)[0]
        const isni = newValues.filter((value) => value.source === ISNI_IDENTIFIER)[0]
        setSelectedIsni(isni);
        setSelectedSiren(siren);
        if (siren) {
            setEditorName(siren.name);
            setEditorialBrand(siren.name);
        }
    }

    useEffect(() => {
            if (selectedIsni && selectedSiren) {
                setOpenAutoComplete(false)
            }
        }, [selectedSiren, selectedIsni]
    )

    const filteredOptions = useMemo(() => {
        let filtered = options;
        if (selectedSiren != null) {
            filtered = filtered.filter((option) => option.source !== SIRENE_IDENTIFIER)
        }
        if (selectedIsni != null) {
            filtered = filtered.filter((option) => option.source !== ISNI_IDENTIFIER)
        }
        return filtered
    }, [options, selectedSiren, selectedIsni])

    const PopperMy = function (props) {
        return (<Popper {...props} placement='top-start'/>)
    }
    return (<>
        <Typography color="primary" variant="h4">Contribution</Typography>
        <Grid container direction='column'>
            <Grid item md={12} sx={{marginTop: theme.spacing(5)}}>
                <Autocomplete
                    PopperComponent={PopperMy}
                    id="grouped-suggest"
                    open={openAutoComplete}
                    onOpen={() => setOpenAutoComplete(true)}
                    onClose={() => setOpenAutoComplete(!selectedSiren || !selectedIsni)}
                    noOptionsText={(selectedSiren && selectedIsni) ? submittedName ? "Sélection complète" : "Aucune correspondance" : "Saisissez quelques lettres"}
                    options={filteredOptions}
                    loading={autocompleteIsLoading}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            let label = '';
                            if (option.source === 'ISNI') {
                                label = `${option.name} : ISNI ${option.identifier}`
                            }
                            if (option.source === 'Sirène') {
                                label = `${option.name} : SIREN ${option.identifier}`
                            }
                            return <Chip variant="outlined" label={label} {...getTagProps({index})} />
                        })
                    }
                    loadingText="Recherche en cours"
                    onChange={optionChoosed}
                    multiple
                    // filterOptions={x => x.source === 'sirene' ? null : x}
                    groupBy={(option) => option.source}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (<Box component="li" {...props} key={`li${option.identifier}`}>
                        <Stack direction='column'>
                            <Stack direction='row'>
                                <Typography variant='body2' sx={{fontSize: "1rem"}}>{option.name}</Typography>
                                {option.type && <Typography variant='subtitle2' sx={{
                                    fontSize: "0.8rem", color: "gray", ml: theme.spacing(2), pt: 0.5
                                }}>{option.type}</Typography>}
                            </Stack>
                            <Typography variant='body2'
                                        sx={{
                                            fontSize: "0.8rem", color: "gray"
                                        }}>{option.identifier}</Typography>
                        </Stack>
                    </Box>)}
                    sx={{width: "100%"}}
                    renderInput={(params) => <TextField {...params} label="Éditeur"
                                                        onChange={(e) => handleUserInputChange(e.target.value)}/>}
                />
            </Grid>
            <Grid item md={12} sx={{marginTop: theme.spacing(3)}}>
                <Grid container direction='row' spacing={theme.spacing(1)}>
                    <Grid item md={6}>
                        <TextField id="siren" label="Siren" value={selectedSiren?.identifier || ''} variant="outlined"
                                   fullWidth
                                   InputLabelProps={{shrink: !!selectedSiren}}
                                   color={selectedSiren ? "error" : "success"}/>
                    </Grid>
                    <Grid item md={6}>
                        <TextField id="ISNI" label="ISNI" value={selectedIsni?.identifier || ''} variant="outlined"
                                   fullWidth
                                   InputLabelProps={{shrink: !!selectedIsni}}
                                   color={selectedIsni ? "error" : "success"}/>
                    </Grid></Grid>
            </Grid>

            <Grid item md={12} sx={{marginTop: theme.spacing(3)}}>
                <TextField id="editor-name" label="Nom éditeur" value={editorName}
                           variant="outlined"
                           fullWidth
                           required
                           InputLabelProps={{shrink: !!editorName}}
                           onChange={(event) => setEditorName(event.target.value)}
                           color={editorName ? "success" : "error"}/>
            </Grid>

            <Grid item md={12} sx={{marginTop: theme.spacing(3)}}>
                <TextField id="editorial-brand" label="Marque éditoriale" value={editorialBrand}
                           variant="outlined"
                           fullWidth
                           required
                           InputLabelProps={{shrink: !!editorialBrand}}
                           onChange={(event) => setEditorialBrand(event.target.value)}
                           color={editorialBrand ? "success" : "error"}/>
            </Grid>
        </Grid>
    </>);
}
