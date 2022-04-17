import React from 'react';
import {Typography, useTheme} from "@mui/material";

export function Contribution() {
    const theme = useTheme();
    return (
        <>
            <Typography color="primary" variant="h4">Contribution</Typography>
        </>
    );
}
