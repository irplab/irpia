import {Grid, Icon, Typography, useTheme} from "@mui/material";
import Logo from "../graphics/logo.svg";
import Banner from "../graphics/banner.svg";
import React from "react";

export function SiteBanner(props) {
    const theme = useTheme();
    return <Grid container spacing={2} sx={{
        paddingLeft: {xs: "0", md: theme.spacing(3), lg: theme.spacing(5)},
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
    }}>
        <Grid item xs={6} md={2}>
            <Grid direction="column" container spacing={0} sx={{
                paddingLeft: {xs: theme.spacing(1), md: theme.spacing(3), lg: theme.spacing(3)},
            }}>
                <Grid item xs={1} lg={1} component={Icon}
                      sx={{maxHeight: "26px", width: "100%", textAlign: "left"}}>
                    <img src={Logo} width={40} height={18}/>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant="subtitle1" component="div" sx={{
                        fontWeight: 600,
                        display: "block",
                        lineHeight: 1.2,
                        fontSize: "16px"
                    }}>
                        MINISTÈRE DE L'ÉDUCATION NATIONALE, DE LA JEUNESSE ET DES SPORTS
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography gutterBottom variant="subtitle1" component="div" sx={{
                        fontWeight: 400,
                        fontStyle: "italic",
                        display: "block",
                        lineHeight: 1.3,
                        fontSize: "10px"
                    }}>
                        Liberté<br/>
                        Égalité<br/>
                        Fraternité
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={1} md={3} lg={2} component={Icon}
              sx={{
                  maxHeight: "200px",
                  height: "100%",
                  textAlign: "left",
                  alignSelf: "center",
                  marginLeft: theme.spacing(4),
                  display: {xs: "none", md: "block"}
              }}>
            <img src={Banner} height={100}/>
        </Grid>
        <Grid item xs={6} md={3} sx={{alignSelf: "center"}}>
            <Typography sx={{fontWeight: 600, color: theme.palette.secondary.light, fontSize: "18px"}}>
                Indexation de Ressources Pédagogiques<br/>
                Intelligente et Assistée
            </Typography>
        </Grid>
    </Grid>;
}