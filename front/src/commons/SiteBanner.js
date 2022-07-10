import {Grid, Icon, Typography, useTheme} from "@mui/material";
import Logo from "../graphics/MIN_Education_Nationale_et_Jeunesse_RVB.png";
import Banner from "../graphics/banner.svg";
import React from "react";

export function SiteBanner(props) {
    const theme = useTheme();
    return <Grid container spacing={2} sx={{
        paddingLeft: {xs: "0", md: theme.spacing(3), lg: theme.spacing(5)},
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }}>
        <Grid item xs={6} md={2} component={Icon} sx={{
            height: "100%",
            textAlign: "left",
            alignSelf: "center"
        }}>
            <img src={Logo} width="100%"/>
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
            <img src={Banner} height={100}/>
        </Grid>
        <Grid item xs={6} md={3} sx={{alignSelf: "center"}}>
            <Typography sx={{fontWeight: 600, color: theme.palette.secondary.main, fontSize: "18px"}}>
                Indexation de Ressources Pédagogiques<br/>
                Intelligente et Assistée
            </Typography>
        </Grid>
    </Grid>;
}