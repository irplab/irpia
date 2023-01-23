import React, {useEffect, useMemo, useRef} from 'react';
import {Box, Button, CircularProgress, Divider, Grid, Icon, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {green} from '@mui/material/colors';
import {useDispatch, useSelector} from "react-redux";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {resetNotice, submitNotice} from "../notice/noticeSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {resetContributors, selectContributors} from "../contribution/contributorsSlice";
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {resetDisplayedNotice} from "../notice/displayedNoticeSlice";
import {resetSuggestions} from "../notice/suggestionsSlice";
import {Clear, RestartAlt} from "@mui/icons-material";
import {useConfirm} from "material-ui-confirm";

import FileSaver from "file-saver";
import {apiV1} from "../../api/api";
import ScolomfrDocument from "./ScolomfrDocument";
import {useReactToPrint} from 'react-to-print';

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
    const [levelValues, setLevelValues] = React.useState([]);
    const [domainValues, setDomainValues] = React.useState([]);



    const printNoticeRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => printNoticeRef.current,
    });

    const webScolomFrDocument = useMemo(() => <ScolomfrDocument notice={notice}
                                                                contributors={contributors?.list}
                                                                base64Image={base64Image}
                                                                base64Type={base64Type}
                                                                levelValues={levelValues}
                                                                domainValues={domainValues}/>, [notice, base64Type, base64Image, levelValues, domainValues])

    const printScolomfrDocument = useMemo(() => <ScolomfrDocument printMode notice={notice}
                                                                  contributors={contributors?.list}
                                                                  base64Image={base64Image}
                                                                  base64Type={base64Type}
                                                                  levelValues={levelValues}
                                                                  domainValues={domainValues}
                                                                  reference={printNoticeRef}/>, [notice, base64Type, base64Image, levelValues, domainValues])


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


    useEffect(async () => {
        // if (!notice.thumbnailUrl) return;
        const response = await apiV1.post(`/concepts`, {values: {domain: notice.domain, level: notice.level}})
        if (response.data['domain']) setDomainValues(Object.values(response.data['domain']))
        if (response.data['level']) setLevelValues(Object.values(response.data['level']))
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
                    <Grid item md={5}>
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
                    <Grid item md={7}
                          alignItems="center">
                        <Box sx={{m: 1, ml: 4, position: 'relative'}}>
                            <Button
                                variant="contained"
                                sx={buttonSx}
                                startIcon={<PrintIcon/>}
                                endIcon={<PictureAsPdfIcon/>}
                                disabled={pending}
                                onClick={() => {
                                    printNoticeRef.current.style.display = "block"
                                    handlePrint()
                                    printNoticeRef.current.style.display = "none"
                                }}
                            >
                                Imprimer mon résumé sur papier ou PDF
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Divider sx={{paddingX: 0, marginBottom: 2}} color={"black"}/>
            {webScolomFrDocument}
            {printScolomfrDocument}
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
                                            description: 'Êtes-vous sûr de vouloir effacer toutes vos données ?',
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
