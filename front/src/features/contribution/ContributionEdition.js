import React, {useCallback, useEffect, useMemo, useState} from 'react';
import InputMask from "react-input-mask";
import {
    Autocomplete,
    Box, Button,
    Card, CardActions,
    CardContent,
    Chip,
    Grid, LinearProgress, MenuItem,
    Popper, Select,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import debounce from "lodash.debounce";
import {getContributors} from "./contributionAPI";
import {useDispatch, useSelector} from "react-redux";
import {deleteContributorById, selectContributorById, updateContributorById} from "./contributorsSlice";
import "./ContributionEdition.module.css"
import {useConfirm} from "material-ui-confirm";
import MuiPhoneNumber from "material-ui-phone-number";

const SIRENE_IDENTIFIER = "Sirène";

const ISNI_IDENTIFIER = "ISNI";

export function ContributionEdition({contributorId, roles}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const contributor = useSelector(state => selectContributorById(state, contributorId));


    const handleDelete = useCallback((e, t) => {
        confirm({title: 'Confirmation', description: 'Voulez-vous supprimer cette contribution ?'})
            .then(() => {
                dispatch(deleteContributorById({contributor}))
            });
    }, [contributor]);

    const [openAutoComplete, setOpenAutoComplete] = useState(false);
    const [submittedName, setSubmittedName] = useState('');
    const [submittedNameChangeFlag, setSubmittedNameChangeFlag] = useState(undefined);
    const [selectedSirenInfo, setSelectedSirenInfo] = useState(null);
    const [customSiren, setCustomSiren] = useState(null);
    const [selectedIsniInfo, setSelectedIsniInfo] = useState(null);
    const [autocompleteSelectedOptions, setAutocompleteSelectedOptions] = useState([]);
    const [customIsni, setCustomIsni] = useState(null);
    const [contributorName, setContributorName] = useState('');
    const [contributorPhoneNumber, setContributorPhoneNumber] = useState('');
    const [contributorRoleLabel, setContributorRoleLabel] = useState(null);
    const [contributorRole, setContributorRole] = useState(null);
    const [contributorEditorialBrand, setContributorEditorialBrand] = useState('');
    const [autocompleteIsLoading, setAutocompleteIsLoading] = useState(false);
    const [options, setOptions] = useState([])


    const updateContributorRoleLabel = (roles, value) => {
        let option = roles.find((role) => role[0] === value);
        if (!option) return;
        setContributorRoleLabel(option[1])
    };

    useEffect(() => {
        setContributorName(contributor.contributorName);
        setContributorPhoneNumber(contributor.contributorPhoneNumber);
        setContributorEditorialBrand(contributor.editorialBrand);
        setSelectedSirenInfo(contributor.selectedSirenInfo);
        setSelectedIsniInfo(contributor.selectedIsniInfo);
        setCustomIsni(contributor.customIsni);
        setCustomSiren(contributor.customSiren);
        setContributorRole(contributor.contributorRole || roles[0][0]);
        updateContributorRoleLabel(roles, contributor.contributorRole);
    }, [])

    useEffect(() => {
        dispatch(updateContributorById({
            contributor: {
                id: contributorId,
                edited: true,
                selectedSirenInfo,
                selectedIsniInfo,
                customSiren,
                customIsni,
                contributorName,
                contributorPhoneNumber,
                editorialBrand: contributorEditorialBrand,
                contributorRole: contributorRole,
                contributorRoleLabel: contributorRoleLabel
            }
        }))
    }, [selectedSirenInfo, selectedIsniInfo, customIsni, customSiren, contributorEditorialBrand, contributorName, contributorPhoneNumber, contributorRole, contributorRoleLabel])

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
    }, [submittedNameChangeFlag])

    const handleSubmittedNameChange = (name) => {
        setSubmittedName(name);
        if (name.match(/^\s*$/)) return;
        setAutocompleteIsLoading(true);
        setSubmittedNameChangeFlag(new Date().valueOf());
    };

    const debouncedChangeHandler = useMemo(() => debounce(handleSubmittedNameChange, 1500), []);
    const handleUserInputChange = (name) => {
        setOptions([])
        debouncedChangeHandler(name)
    };

    const optionChoosed = (event, newValues) => {
        const siren = newValues.filter((value) => value.source === SIRENE_IDENTIFIER)[0]
        const isni = newValues.filter((value) => value.source === ISNI_IDENTIFIER)[0]
        setSelectedIsniInfo(isni);
        setSelectedSirenInfo(siren);
        if (isni) {
            setCustomIsni(null);
        }
        if (siren) {
            setCustomSiren(null)
            setContributorName(siren.name);
            setContributorEditorialBrand(siren.name);
        }
    }

    const roleChoosed = useCallback((value, roles) => {
        setContributorRole(value);
        updateContributorRoleLabel(roles, value);
    }, [roles])

    useEffect(() => {
            if (selectedIsniInfo && selectedSirenInfo) {
                setOpenAutoComplete(false)
            }
        }, [selectedSirenInfo, selectedIsniInfo]
    )

    const currentSiren = useMemo(() => {
        return customSiren || selectedSirenInfo?.identifier || ''
    }, [customSiren, selectedSirenInfo])

    const currentIsni = useMemo(() => {
        return customIsni || selectedIsniInfo?.identifier || ''
    }, [customIsni, selectedIsniInfo])

    const filteredOptions = useMemo(() => {
        let filtered = options;
        if (selectedSirenInfo != null) {
            filtered = filtered.filter((option) => option.identifier === currentSiren || option.source !== SIRENE_IDENTIFIER)
        }
        if (selectedIsniInfo != null) {
            filtered = filtered.filter((option) => option.identifier === currentIsni || option.source !== ISNI_IDENTIFIER)
        }
        return filtered
    }, [options, selectedSirenInfo, selectedIsniInfo])

    useEffect(() => {
        setAutocompleteSelectedOptions([selectedIsniInfo, selectedSirenInfo].filter(function (el) {
            return el != null;
        }));
    }, [selectedSirenInfo, selectedIsniInfo])

    const PopperMy = function (props) {
        return (<Popper {...props} placement='top-start'/>)
    }
    return (
        <Card sx={{marginTop: theme.spacing(2), border: 'none', boxShadow: 'none'}}>
            <CardContent>
                <Grid container direction='column'>
                    <Grid item md={12} sx={{marginTop: theme.spacing(1)}}>
                        <Select
                            labelId="educational-resource-type-select-label"
                            id="educational-resource-type-select"
                            label='Type de ressource'
                            value={contributorRole}
                            onChange={(e) => roleChoosed(e.target.value, roles)}
                        >
                            {roles.map((entry) => (
                                <MenuItem key={`option-educational-resource-type-${entry[0]}`}
                                          value={entry[0]}>{entry[1]}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item md={12} sx={{marginTop: theme.spacing(5)}}>
                        <Autocomplete
                            PopperComponent={PopperMy}
                            value={autocompleteSelectedOptions}
                            isOptionEqualToValue={(option, value) => {
                                return option.source === value.source && option.identifier === value.identifier;
                            }}
                            getOptionDisabled={(option) =>
                                option?.disabled === true
                            }
                            id="grouped-suggest"
                            onBlur={() => setOpenAutoComplete(false)}
                            open={openAutoComplete}
                            onOpen={() => setOpenAutoComplete(true)}
                            onClose={() => setOpenAutoComplete(!selectedSirenInfo || !selectedIsniInfo)}
                            noOptionsText={(selectedSirenInfo && selectedIsniInfo) ? submittedName ? "Sélection complète" : "Aucune correspondance" : "Saisissez quelques lettres"}
                            options={filteredOptions}
                            filterOptions={(options) =>
                                options
                            }
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

                            loadingText={<><i>Recherche en cours</i><LinearProgress/></>}
                            onChange={optionChoosed}
                            multiple
                            // filterOptions={x => x.source === 'sirene' ? null : x}
                            groupBy={(option) => option?.source}
                            getOptionLabel={(option) => option.name}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={`li${option.identifier}`}>
                                    <Stack direction='column'>
                                        <Stack direction='row'>
                                            <Typography variant='body2'
                                                        sx={{fontSize: "1rem"}}>{option.name}</Typography>
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

                                <InputMask
                                    id="siren"
                                    mask="999 999 999"
                                    value={currentSiren}
                                    disabled={false}
                                    maskChar=" "
                                    onChange={(e) => {
                                        setCustomSiren(e.target.value);
                                        setSelectedSirenInfo(null);
                                        console.log("cleared selected siren")
                                    }
                                    }
                                >
                                    {() => <TextField label="Siren" variant="outlined" fullWidth
                                                      InputLabelProps={{shrink: !!currentSiren}}
                                                      color={selectedSirenInfo ? "error" : "success"}/>}
                                </InputMask>
                            </Grid>
                            <Grid item md={6}>
                                <InputMask
                                    id="isni"
                                    mask="9999-9999-9999-9999"
                                    value={currentIsni}
                                    disabled={false}
                                    maskChar=" "
                                    onChange={(e) => {
                                        setCustomIsni(e.target.value);
                                        setSelectedIsniInfo(null);
                                    }
                                    }
                                >
                                    {() => <TextField label="ISNI" variant="outlined" fullWidth
                                                      InputLabelProps={{shrink: !!currentIsni}}
                                                      color={selectedIsniInfo ? "error" : "success"}/>}
                                </InputMask>
                            </Grid></Grid>
                    </Grid>

                    <Grid item md={12} sx={{marginTop: theme.spacing(3)}}>
                        <TextField id="contributor-name" label="Nom éditeur" value={contributorName}
                                   variant="outlined"
                                   fullWidth
                                   required
                                   InputLabelProps={{shrink: !!contributorName}}
                                   onChange={(event) => setContributorName(event.target.value)}
                                   color={contributorName ? "success" : "error"}/>
                    </Grid>

                    <Grid item md={12} sx={{marginTop: theme.spacing(3)}}>
                        <TextField id="contributor-editorial-brand" label="Marque éditoriale"
                                   value={contributorEditorialBrand}
                                   variant="outlined"
                                   fullWidth
                                   required
                                   InputLabelProps={{shrink: !!contributorEditorialBrand}}
                                   onChange={(event) => setContributorEditorialBrand(event.target.value)}
                                   color={contributorEditorialBrand ? "success" : "error"}/>
                    </Grid>

                    <Grid item md={12} sx={{marginTop: theme.spacing(3), marginLeft: theme.spacing(1)}}>
                        <MuiPhoneNumber
                            variant="outlined"
                            sx={{
                            svg: {
                                height: "20px",
                            },
                        }} defaultCountry={'fr'} value={contributorPhoneNumber}
                                        onChange={(value) => setContributorPhoneNumber(value)}/>
                    </Grid>
                </Grid></CardContent>
            <CardActions sx={{
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <Button size="small"
                        color="error" variant="text" onClick={handleDelete}>Supprimer</Button>
                <Button size="small"
                        variant="contained"
                        onClick={() => dispatch(updateContributorById({
                            contributor: {
                                ...contributor,
                                edited: false
                            }
                        }))}>Enregistrer</Button>
            </CardActions>
        </Card>);
}
