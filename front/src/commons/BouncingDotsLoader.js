import React from "react";
import './boucing-dots-style.css';
import {Box} from "@mui/material";

const BouncingDotsLoader = ({bouncing}) => {
    return (
        <Box component="div" className={"bouncing-loader" + (bouncing ? " dance" : "")}>
            <div></div>
            <div></div>
            <div></div>
        </Box>
    );
};


export default BouncingDotsLoader;