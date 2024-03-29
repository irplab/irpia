import {Grid, Icon, Typography, useTheme} from "@mui/material";
import Logo from "../graphics/MIN_Education_Nationale_et_Jeunesse_RVB.png";
import Banner from "../graphics/banner.svg";
import React from "react";

export function SiteBanner() {
    const theme = useTheme();
    return <Grid container spacing={2} sx={{
        paddingLeft: {xs: "0", md: theme.spacing(3), lg: theme.spacing(5)},
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }}>
        <Grid item xs={6} sm={4} md={3} lg={1} component={Icon} sx={{
            height: "100%",
            textAlign: "left",
            alignSelf: "center"
        }}>
            <img src={Logo} width="100%" alt="Logo"/>
        </Grid>
        <Grid item xs={0} md={3} lg={2} component={Icon}
              sx={{
                  maxHeight: "200px",
                  height: "100%",
                  textAlign: "left",
                  alignSelf: "center",
                  marginLeft: theme.spacing(4),
                  display: {xs: "none", md: "block"}
              }}>
            <img src={Banner} height={100} alt="Bannière IRPIA"/>
        </Grid>
        <Grid item xs={6} sm={8} md={5} sx={{alignSelf: "center"}}>
            <Typography
                sx={{
                    lineHeight: 1.3,
                    fontWeight: 600,
                    color: theme.palette.secondary.main,
                    fontSize: {xs: "1.2rem", sm: "2rem", md: "1.6rem", lg: "1.4rem"}
                }}>
                Indexation de Ressources Pédagogiques<br/>
                Intelligente et Assistée
            </Typography>
        </Grid>
    </Grid>;
}