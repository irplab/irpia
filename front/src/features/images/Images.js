import React from 'react';
import {Box, Button, CircularProgress, Typography, useTheme} from "@mui/material";
import {green} from '@mui/material/colors';
import {useDispatch, useSelector} from "react-redux";
import {submitNotice} from "../notice/noticeSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {selectContributors} from "../contribution/contributorsSlice";

export function Images() {
    const theme = useTheme();
    const dispatch = useDispatch();

    const notice = useSelector((state) => state.notice.value)
    const {pending} = useSelector((state) => state.notice);

    return (
        <Typography>Images</Typography>
    );
}
