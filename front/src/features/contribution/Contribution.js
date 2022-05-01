import React, {useEffect, useMemo, useState} from 'react';
import {Autocomplete, Box, Grid, Stack, TextField, Typography, useTheme} from "@mui/material";
import debounce from "lodash.debounce";
import {initSuggestion} from "../notice/suggestionsSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {getContributors} from "../notice/contributionAPI";

export function Contribution() {
    const theme = useTheme();
    const [submittedName, setSubmittedName] = useState('');
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

    return (
        <>
            <Typography color="primary" variant="h4">Contribution</Typography>
            <Grid container direction='column'>
                <Grid item md={12} sx={{marginTop: theme.spacing(5)}}>
                    <Autocomplete
                        id="grouped-suggest"
                        noOptionsText={submittedName ? "Aucune correspondance" : "Saisissez quelques lettres"}
                        options={options}
                        loading={autocompleteIsLoading}
                        loadingText="Recherche en cours"
                        groupBy={(option) => option.source}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} key={`li${option.siren}`}>
                                <Stack direction='column'>
                                    <Typography variant='body1' sx={{fontSize: "1rem"}}>{option.name}</Typography>
                                    <Typography variant='body2'
                                                sx={{fontSize: "0.8rem", color: "gray"}}>{option.siren}</Typography>
                                </Stack>
                            </Box>
                        )}
                        sx={{width: "100%"}}
                        renderInput={(params) => <TextField {...params} label="Éditeur"
                                                            onChange={(e) => handleUserInputChange(e.target.value)}/>}
                    />
                </Grid>
            </Grid>
        </>
    );
}
