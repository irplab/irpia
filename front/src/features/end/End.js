import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, Button, CircularProgress, Divider, Grid, Icon, Typography, useTheme} from "@mui/material";
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
import JsPDF from 'jspdf';


import FileSaver from "file-saver";
import Image from "mui-image";
import {apiV1} from "../../api/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function End() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const notice = useSelector((state) => state.notice.value)
    const contributors = useSelector(state => selectContributors(state))
    const {pending} = useSelector((state) => state.notice);
    const [success, setSuccess] = React.useState(false);
    const [base64Image, setBase64Image] = React.useState(null);
    const [base64Type, setBase64Type] = React.useState(false);

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const useResize = (myRef) => {

        const handleResize = useCallback(() => {
            setWidth(myRef.current.offsetWidth)
            setHeight(myRef.current.offsetHeight)
        }, [myRef])

        useEffect(() => {
            window.addEventListener('load', handleResize)
            window.addEventListener('resize', handleResize)
            handleResize();

            return () => {
                window.removeEventListener('load', handleResize)
                window.removeEventListener('resize', handleResize)
            }
        }, [myRef, handleResize])

    }

    const componentRef = useRef()
    useResize(componentRef)


    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };
    const navigate = useNavigate();

    useEffect(async () => {
        // if (!notice.thumbnailUrl) return;
        const response = await apiV1.post(`/image`, {image: {url: notice.thumbnailUrl}})
        setBase64Image(response.data.image)
        setBase64Type(response.data.type)
    }, [notice])

    return (
        <><Grid container direction="column" pb={theme.spacing(2)}>

            <Grid item sx={{display: 'flex', textAlign: 'center'}}>
                <Typography fontSize='1.2rem' sx={{fontWeight: "bold"}} textAlign="center" width="100%" color="primary">Bravo
                    ! Vous avez terminé <Icon sx={{verticalAlign: "middle"}} opacity={0.5} fontSize="large"
                                              color="primary" component={CheckCircleIcon}/></Typography>

            </Grid>
            <Grid item sx={{display: 'flex', alignItems: 'center'}} mt={theme.spacing(3)}>
                <Typography fontSize='1rem' sx={{fontWeight: "bold"}} textAlign="center" width="100%">Télécharger
                    ma notice ScoLomfr</Typography></Grid>
            <Grid item sx={{justifyContent: "center", display: "flex"}} mt={theme.spacing(1)}>
                <Grid container direction="row">
                    <Grid item md={6}>
                        <Box sx={{m: 1, mr: 4, position: 'relative'}} textAlign="right">
                            <Button
                                variant="contained"
                                sx={buttonSx}
                                startIcon={<DownloadIcon/>}
                                disabled={pending}
                                onClick={() => {
                                    dispatch(submitNotice({
                                        ...notice,
                                        contributors
                                    })).then(unwrapResult).then((data) => {
                                        setSuccess(true);
                                        const blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                                        FileSaver.saveAs(blob, "notice.xml");
                                    }).catch((error) => {
                                        console.log(error)
                                    });

                                }}
                            >
                                Ma notice en XML
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
                    <Grid item md={6}
                          alignItems="center">
                        <Box sx={{m: 1, ml: 4, position: 'relative'}}>
                            <Button
                                variant="contained"
                                sx={buttonSx}
                                startIcon={<DownloadIcon/>}
                                disabled={pending}
                                onClick={async () => {
                                    // const report = new JsPDF('portrait', 'pt', 'a4');
                                    // report.html(document.querySelector('#notice-display'), {margin: [10, 10, 10, 40]}).then(() => {
                                    //     report.save('report.pdf');
                                    // });
                                    const quality = 1 // Higher the better but larger
                                    console.log(width, height)
                                    html2canvas(document.querySelector('#notice-display')
                                    ).then(canvas => {
                                        const pdf = new jsPDF('p', 'mm', 'a4');
                                        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 200, 298 * 200 / width);
                                        pdf.save('report.pdf');
                                    });
                                }}
                            >
                                Mon résumé en PDF
                            </Button>

                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{paddingX: 0, marginBottom: 2}} color={"black"}/>
            <Grid container direction="column" spacing={2} id="notice-display" ref={componentRef}>
                <Grid item>
                    <Grid container direction="row" spacing={2}>
                        <Grid item md={3}><Image showLoading={false}
                                                 src={`data:${base64Type};base64,${base64Image}`}/></Grid>
                        <Grid item md={9}>
                            <Grid container direction="column">
                                <Grid item md={12}>
                                    <Typography component="h3"
                                                variant="h6">{notice.educationalResourceTypeLabel.join(", ")}</Typography>
                                    <Typography component="h2" color="primary" variant="h4">{notice.title}</Typography>
                                    <Typography>{notice.url}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid component={Box} item width="100%" m={0} p={theme.spacing(1)} pt={0} mt={2}
                      sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText
                      }}><Typography component="h3"
                                     variant="h5">Présentation</Typography></Grid>
            </Grid>
        </Grid>
            <Box width="100%" ml={-5} minWidth="120%" height={theme.spacing(2)} sx={{backgroundColor: "#F8FBFF"}}></Box>
            <Grid container direction="row" mt={theme.spacing(3)}>
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
                                            description: 'Êtes-vous sûre de vouloir effacer toutes vos données ?',
                                            cancellationText: 'Annuler'
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
