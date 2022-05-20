import React from 'react';
import {Button, Link, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";

export function End() {
    const theme = useTheme();

    const navigate = useNavigate();
    return (
        <>
            <Typography>Fini</Typography>
            <Link href="#">Télécharger votre notice ScolomFr</Link>
            <br/>
            <Button onClick={() => navigate('/form/notice')}>Nouvelle notice avec les mêmes contributeurs</Button>
            <br/>
            <Button onClick={() => navigate('/form/contribution')}>Remettre à zéro</Button>
        </>
    );
}
