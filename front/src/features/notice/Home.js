import React from 'react';
import {Box, Container, Grid, Typography, useTheme} from "@mui/material";
import Character from '../../graphics/personnage.svg';
import BgHome from "../../graphics/bg_home.svg";
import Banner from "../../graphics/banner.svg";

export function Home() {
    const theme = useTheme();
    return (
        <Grid container>
            <Grid item md={6} xs={12}>
                <Grid container direction='column' sx={{
                    paddingLeft: {xs: theme.spacing(2), md: theme.spacing(8)},
                    paddingTop: {xs: theme.spacing(8), sm: theme.spacing(8), lg: theme.spacing(8)}
                }}>
                    <Grid item alignSelf='center' component={Box} sx={{display: {md: 'inline', xs: 'none'}}}>
                        <img src={Character} height={200} sx={{textAlign: 'center'}}/>
                    </Grid>
                    <Grid item alignSelf='center' component={Box}
                          sx={{mt: -4, mb: 2, display: {md: 'none', xs: 'inline'}}}>
                        <img src={Banner} height={150} sx={{textAlign: 'center'}}/>
                    </Grid>
                    <Grid item><Typography variant='h2' sx={{
                        fontSize: "3rem",
                        [theme.breakpoints.down("sm")]: {
                            fontSize: "2rem"
                        },
                        lineHeight: 1,
                        fontWeight: '500',
                        color: theme.palette.secondary.light
                    }}>Prototype d'assistant intelligent pour la description de vos ressources
                        pédagogiques</Typography> </Grid>
                    <Grid item sx={{marginTop: theme.spacing(2)}}><Typography variant='subtitle1'
                                                                              sx={{lineHeight: 1.2}}>
                        Saisir les informations qui permettront aux utilisateurs de trouver les ressources que vous
                        proposez
                        est difficile.<br/>
                        En mobilisant des technologies d'assistances mues par l'intelligence artificielle, IRPIA vous
                        facilite la tâche.
                    </Typography></Grid>
                </Grid>
            </Grid>
            <Grid item sm={6} md={6} sx={{display: {md: 'block', sm: 'none', xs: 'none'}}}>
                <img src={BgHome} width='100%' sx={{textAlign: 'center'}}/>
            </Grid>

        </Grid>
    );
}
