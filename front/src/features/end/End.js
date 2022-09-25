import React from 'react';
import {Box, Button, CircularProgress, Grid, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {green} from '@mui/material/colors';
import {useDispatch, useSelector} from "react-redux";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {resetNotice, submitNotice} from "../notice/noticeSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {resetContributors, selectContributors} from "../contribution/contributorsSlice";
import DownloadIcon from '@mui/icons-material/Download';
import {resetDisplayedNotice} from "../notice/displayedNoticeSlice";
import {resetSuggestions} from "../notice/suggestionsSlice";
import {Clear, RestartAlt} from "@mui/icons-material";
import {useConfirm} from "material-ui-confirm";


export function End() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const notice = useSelector((state) => state.notice.value)
    const contributors = useSelector(state => selectContributors(state))
    const {pending} = useSelector((state) => state.notice);
    const [success, setSuccess] = React.useState(false);
    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };
    const navigate = useNavigate();
    return (
        <><Grid container direction="column" pb={theme.spacing(2)}>

            <Grid item sx={{display: 'flex', textAlign: 'center'}}>
                <Typography fontSize='1.2rem' sx={{fontWeight: "bold"}} textAlign="center" width="100%" color="primary">Bravo
                    ! Vous avez terminé</Typography>
            </Grid>
            <Grid item sx={{justifyContent: "center", display: "flex"}}>
                <Box
                    component={CheckCircleIcon}
                    color="secondary"
                    mt={theme.spacing(2)}
                    sx={{
                        height: 100,
                        width: 100,
                        opacity: 0.5,
                        color: (theme) => theme.palette.primary.main,
                        maxHeight: {xs: 40, md: 100},
                        maxWidth: {xs: 40, md: 100},

                    }}
                />
            </Grid>
            <Grid item sx={{display: 'flex', alignItems: 'center'}} mt={theme.spacing(3)}>
                <Typography fontSize='1rem' sx={{fontWeight: "bold"}} textAlign="center" width="100%">Télécharger
                    mon fichier ScoLomfr</Typography></Grid>
            <Grid item sx={{justifyContent: "center", display: "flex"}} mt={theme.spacing(1)}>
                <Box sx={{m: 1, position: 'relative'}}>
                    <Button
                        variant="contained"
                        sx={buttonSx}
                        startIcon={<DownloadIcon/>}
                        disabled={pending}
                        onClick={() => {
                            dispatch(submitNotice({...notice, contributors})).then(unwrapResult).then((data) => {
                                setSuccess(true);
                                const FileSaver = require('file-saver');
                                const blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                                FileSaver.saveAs(blob, "notice.xml");
                            }).catch((error) => {
                                console.log(error)
                            });

                        }}
                    >
                        Télécharger
                    </Button>
                    {pending && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </Grid>
        </Grid>
            <Box width="100%" ml={-5} minWidth="120%" height={theme.spacing(2)} sx={{backgroundColor: "#F8FBFF"}}></Box>
            <Grid container direction="row" mt={theme.spacing(3)} sx={{backgroundColor: "#F8FBFF"}}>
                <Grid item md={6} xs={12}>
                    <Grid container direction='column'>
                        <Grid item>
                            <Typography fontSize='1rem' textAlign="center" width="100%">Reprendre au début sans remise à
                                zero</Typography>
                        </Grid>
                        <Grid item sx={{justifyContent: "center", display: "flex"}} mt={theme.spacing(2)}>
                            <Button
                                startIcon={<RestartAlt/>}
                                variant="outlined" onClick={() => navigate('/wizard/description')}>Nouvelle
                                notice</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} xs={12} sx={{marginTop: {xs: theme.spacing(4), sm: 0}}}>
                    <Grid container direction='column'>
                        <Grid item>
                            <Typography fontSize='1rem' textAlign="center" width="100%">Nouvelle notice avec remize à
                                zéro</Typography>
                        </Grid>
                        <Grid item sx={{justifyContent: "center", display: "flex"}} mt={theme.spacing(2)}>
                            <Button variant="outlined"
                                    startIcon={<Clear/>}
                                    onClick={() => {
                                        confirm({
                                            title: 'Réinitialisation',
                                            description: 'Êtes-vous sûre de vouloir effacer toutes vos données ?'
                                        }).then(
                                            () => {
                                                Promise.all(
                                                    [dispatch(resetContributors()),
                                                        dispatch(resetNotice()),
                                                        dispatch(resetDisplayedNotice()),
                                                        dispatch(resetSuggestions())]
                                                ).then(() => navigate('/wizard/description'));
                                            }
                                        )
                                    }}>Remize à zero</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
        ;
}
