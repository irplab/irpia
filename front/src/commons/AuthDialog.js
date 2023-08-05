import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    useTheme
} from "@mui/material";
import {useDispatch} from "react-redux";
import {unwrapResult} from "@reduxjs/toolkit";
import {submitAuth} from "./authSlice";

export const AuthDialog = ({open, handleClose}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Déverrouiller</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Pour activer les fonctionnalités en accès restreint (GPT), veuillez entrer un identifiant et un mot
                    de passe .
                </DialogContentText>
                <TextField
                    autoFocus
                    id="identifier"
                    label="Identifiant"
                    type="text"
                    variant="outlined"
                    sx={{m: theme.spacing(2)}}
                />
                <TextField
                    autoFocus
                    id="password"
                    label="Mot de passe"
                    type="text"
                    variant="outlined"
                    sx={{m: theme.spacing(2)}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={() => {
                    dispatch(submitAuth({
                        login: "login",
                        password: "password"
                    })).then(unwrapResult).then((data) => {
                        console.log(data)
                    }).catch((error) => {
                        console.log(error)
                    });

                }}>Activer</Button>
            </DialogActions>
        </Dialog>
    )
        ;
};