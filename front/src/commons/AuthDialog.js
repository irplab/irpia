import React from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField, Typography,
    useTheme
} from "@mui/material";
import {useDispatch} from "react-redux";
import {unwrapResult} from "@reduxjs/toolkit";
import {submitAuth, login} from "./authSlice";

export const AuthDialog = ({open, handleClose}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(false);
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Déverrouiller les fonctionnalités avancées</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Pour activer certaines fonctionnalités en accès restreint (GPT), veuillez entrer un identifiant et un mot
                    de passe .
                </DialogContentText>
                <TextField
                    autoFocus
                    id="identifier"
                    label="Identifiant (email)"
                    placeholder="monemail@mail.com"
                    type="text"
                    variant="outlined"
                    sx={{m: theme.spacing(2)}}
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                    error={error}
                />
                <TextField
                    autoFocus
                    id="password"
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    sx={{m: theme.spacing(2)}}
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                    error={error}
                />
                {error && <Alert severity="error">Échec de l'authentification.</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={() => {
                    dispatch(submitAuth({
                        login: email,
                        password: password
                    })).then(unwrapResult).then((data) => {
                        setError(false)
                        dispatch(login())
                        handleClose()
                    }).catch((error) => {
                        setError(true)
                        console.log(error)
                    });

                }}>Activer</Button>
            </DialogActions>
        </Dialog>
    )
        ;
};