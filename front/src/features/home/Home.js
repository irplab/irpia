import React from 'react';
import {Box, Button, Grid, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Character from '../../graphics/personnage.svg';
import BgHome from "../../graphics/bg_home.svg";
import Banner from "../../graphics/banner.svg";

export function Home() {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Grid container>
            <Grid item md={5} xs={12}>
                <Grid container direction='column' sx={{
                    paddingLeft: {xs: theme.spacing(2), md: theme.spacing(12)},
                    paddingRight: {xs: theme.spacing(2), md: theme.spacing(4)},
                    paddingTop: {xs: theme.spacing(8), sm: theme.spacing(8), lg: theme.spacing(8)}
                }}>
                    <Grid item alignSelf='center' component={Box} sx={{display: {md: 'inline', xs: 'none'}}}>
                        <img src={Character} height={200} alt="Personnage IRPIA"/>
                    </Grid>
                    <Grid item alignSelf='center' component={Box}
                          sx={{mt: -4, mb: 2, display: {md: 'none', xs: 'inline'}}}>
                        <img src={Banner} height={150} alt="Bannière IPIA"/>
                    </Grid>
                    <Grid item><Typography variant='h2' color='secondary' sx={{
                        lineHeight: 1.1,
                        fontSize: "3rem",
                        [theme.breakpoints.down("sm")]: {
                            fontSize: "2rem"
                        }
                    }}>Prototype d'assistant intelligent pour la description de vos ressources
                        pédagogiques</Typography> </Grid>
                    <Grid item sx={{marginTop: theme.spacing(6)}}><Typography variant='subtitle2'
                                                                              sx={{lineHeight: 1.4}}>
                        Vous souhaitez indexer une ressource pédagogique afin que vos utilisateurs la trouvent ? Essayez
                        l’assistant IRPIA ! <br/>En mobilisant des technologies d'assistance mues par l'intelligence
                        artificielle, IRPIA vous facilite la tâche.

                    </Typography></Grid>
                    <Grid item my={4}>
                        <Button variant="contained"
                                onClick={() => navigate('/form/contribution')}>Commencez</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={6} md={7} sx={{display: {md: 'block', sm: 'none', xs: 'none'}}}>
                <img src={BgHome} width='100%' alt="Fond de page"/>
            </Grid>

        </Grid>
    );
}
