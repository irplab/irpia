import React from 'react';
import {Box, Button, CircularProgress, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {green} from '@mui/material/colors';
import {useDispatch, useSelector} from "react-redux";
import {submitNotice} from "../notice/noticeSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {selectContributors} from "../contribution/contributorsSlice";

export function End() {
    const theme = useTheme();
    const dispatch = useDispatch();

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
        <><Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{m: 1, position: 'relative'}}>
                <Button
                    variant="contained"
                    sx={buttonSx}
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
                    Générer votre notice ScolomFr
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
        </Box>
            <br/>
            <Button onClick={() => navigate('/form/notice')}>Nouvelle notice avec les mêmes contributeurs</Button>
            <br/>
            <Button onClick={() => navigate('/form/contribution')}>Remettre à zéro</Button>
        </>
    );
}
