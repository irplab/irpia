import React from 'react';
import {Container, Grid, Typography, useTheme} from "@mui/material";
import BgFormLeft from '../../graphics/bg_form_left.svg';

export function About() {
    const theme = useTheme();


    return (<Grid container sx={{backgroundColor: "#F8FBFF", height: "100%"}}>
        <Grid item md={3} xs={12} sx={{display: {md: 'block', sm: 'none', xs: 'none'}, pt: theme.spacing(6)}}>
            <img src={BgFormLeft} width='100%'/>
        </Grid>
        <Grid item md={6} xs={12}>
            <Typography variant="h4" color="secondary" align="center"
                        sx={{mt: theme.spacing(5), mx: theme.spacing(4)}}>Outil d’indexation de ressources pédagogiques
                intelligent et assisté</Typography>
            <Typography variant="subtitle2" align="center" sx={{mt: theme.spacing(2), mx: theme.spacing(4)}}>Le
                Ministère de l’Éducation Nationale et de la Jeunesse est engagé dans des projets innovants dans le
                domaine de la description des ressources pédagogiques depuis de nombreuses années. IRPIA est une preuve
                de concept (POC ou proof of concept) qui propose un prototype d’outil d’indexation de ressources
                pédagogiques intelligent et assisté..</Typography>
            <Container sx={{backgroundColor: "#FFFFFF", mt: theme.spacing(5), p: theme.spacing(5)}}>
                <Typography>Le prototype utilise des technologies du traitement automatique du
                    langage et d’apprentissage profond. L’outil se base sur des algorithmes de classification
                    automatique et
                    d’extraction de données afin de proposer des informations sur certains champs. </Typography>
                <Typography> L’objectif est d’aider
                    les parties prenantes du GAR (Gestionnaire d’accès aux ressources) à créer leurs notices
                    descriptives à
                    partir de leur adresse web.</Typography> <Typography> Dans tous les cas, les utilisateurs pourront
                accepter, décliner ou affiner
                les propositions faites par les algorithmes.</Typography> <Typography>
                Dans le cas de l’extraction des informations à partir de la page de la ressource, l’algorithme utilise
                des approches heuristiques ou des approches de type apprentissage profond. Les algorithmes
                d’apprentissage profond sont mis en œuvre sur les informations ainsi extraites. </Typography>
                <Typography>L’objectif
                    principal de
                    la preuve de concept est d'appréhender ce qui est possible de réaliser en termes d’assistance à la
                    saisie en utilisant le standard ScoLOMFR.</Typography>
                <Typography variant='h4' my={theme.spacing(1)}> Mode de fonctionnement</Typography>
                <Typography> Tout d’abord, l’utilisateur accède à un écran de saisie des contributeurs à la réalisation
                    de la
                    ressource pédagogique. À partir du nom du contributeur, IRPIA proposera automatiquement le numéro de
                    SIREN et / ou le numéro ISNI permettant de l’identifier, ainsi que le nom et la marque éditoriale.
                    Les
                    différents contributeurs sont enregistrés.</Typography>
                <Typography>Ensuite, l’utilisateur peut commencer à créer sa notice descriptive en indiquant à IRPIA
                    l’URL de la
                    ressource pédagogique. L’assistant va proposer des suggestions pour le titre, la description à
                    partir du
                    contenu de la page de la ressource. Il proposera également des domaines d’enseignement et des
                    niveaux
                    éducatifs conformes au standard ScoLOMFR. L’utilisateur peut sélectionner les domaines qui lui
                    semblent
                    pertinents ou consulter la liste plus complète des domaines ou des niveaux éducatifs pour en choisir
                    un.
                    Une fois que les éléments de description sont renseignés, l’assistant IRPIA proposera des images
                    trouvées sur la page de la ressource afin de les utiliser en tant que vignette d’identification
                    visuelle
                    de la ressource.</Typography>
                <Typography>À la fin du processus, l’utilisateur peut télécharger la notice descriptive conforme au
                    ScoLOMFR au
                    format XML. Il peut aussi commencer une nouvelle notice en conservant les informations sur les
                    contributeurs ou la démarrer à zéro.</Typography>
            </Container>
        </Grid>
        <Grid item md={3} xs={12} textAlign='center' sx={{display: {md: 'block', sm: 'none', xs: 'none'}}}>
            <Typography pt={theme.spacing(5)}>À propos</Typography>
        </Grid>

    </Grid>);
}
