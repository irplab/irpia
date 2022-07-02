import React, {useEffect} from 'react';
import {Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {suggestionsSelectors} from "../notice/suggestionsSlice";

export function Images() {
    const theme = useTheme();
    const dispatch = useDispatch();

    const notice = useSelector((state) => state.notice.value)
    const lastImageSuggestions = useSelector((state) => suggestionsSelectors.selectAll(state.suggestions)?.at(-1)?.suggestions?.images);
    const {pending} = useSelector((state) => state.notice);

    useEffect(() => console.log(lastSuggestion), [])

    return (
        <Typography>Images</Typography>
    );
}
