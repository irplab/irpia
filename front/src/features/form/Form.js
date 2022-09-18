import React, {useCallback, useEffect} from 'react';
import {Button, Container, Grid, Step, StepButton, Stepper, Typography, useTheme} from "@mui/material";
import BgFormLeft from '../../graphics/bg_form_left.svg';
import {useLocation, useNavigate} from "react-router-dom";
import {Notice} from "../notice/Notice";
import {Contributions} from "../contribution/Contributions";
import {End} from "../end/End";
import {Images} from "../images/Images";


const steps = ['contribution', 'notice', 'images', 'end'];
const stepLabels = ['Contributions', 'Description', 'Illustration', 'Terminé !'];

function ContributionsInstructions(props) {
    return <>
        <Typography variant="h4" color="secondary" align="center"
                    sx={{mt: props.theme.spacing(5), mx: props.theme.spacing(4)}}>Assistant
            d’indexation intelligent - Contributeurs</Typography>
        <Typography variant="subtitle2" align="center" sx={{mt: props.theme.spacing(2), mx: props.theme.spacing(4)}}>Munissez-vous
            du nom des personnes morales ou physiques ayant contribué à la réalisation de la ressource pédagogique à
            indexer.
            L’assistant IRPIA, à partir du nom du contributeur, vous aidera à compléter le numéro de SIREN, le numéro
            ISNI, le nom et la marque éditoriale.</Typography>
    </>;
}

function NoticeInstructions(props) {
    return <>
        <Typography variant="h4" color="secondary" align="center"
                    sx={{mt: props.theme.spacing(5), mx: props.theme.spacing(4)}}>Assistant
            d’indexation intelligent - Notice</Typography>
        <Typography variant="subtitle2" align="center" sx={{mt: props.theme.spacing(2), mx: props.theme.spacing(4)}}>Saisissez
            l’adresse URL de la ressource pédagogique que vous souhaitez indexer.
            L’assistant IRPIA, vous proposera des suggestions pour compléter le titre, la description, les domaines
            d’enseignement et les niveaux éducatifs. Une fois sélectionnés, vous pourrez les modifier.</Typography>
    </>;
}

function ImagesInstructions(props) {
    return <>
        <Typography variant="h4" color="secondary" align="center"
                    sx={{mt: props.theme.spacing(5), mx: props.theme.spacing(4)}}>Assistant
            d’indexation intelligent - Illustration</Typography>
        <Typography variant="subtitle2" align="center" sx={{mt: props.theme.spacing(2), mx: props.theme.spacing(4)}}>Choisissez
            une image proposée par l’assistant IRPIA afin d’illustrer la ressource pédagogique. <br/>
            <br/>
            <br/>
        </Typography>

    </>;
}

function EndInstructions(props) {
    return <>
        <Typography variant="h4" color="secondary" align="center"
                    sx={{mt: props.theme.spacing(5), mx: props.theme.spacing(4)}}>Assistant
            d’indexation intelligent - Téléchargement</Typography>
        <Typography variant="subtitle2" align="center" sx={{mt: props.theme.spacing(2), mx: props.theme.spacing(4)}}>
            Vous avez terminé ! Maintenant, vous pouvez télécharger la notice que vous avez crée conforme au ScoLOMFR au
            format XML.
            Vous pouvez aussi initier une nouvelle notice avec les mêmes contributeurs ou réinitialiser le formulaire.
        </Typography>
    </>;
}

export function Form() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeStep, setActiveStep] = React.useState(0);

    const [navigationFromSteps, setNavigationFromSteps] = React.useState(false);

    const [completed,] = React.useState({});

    const stepFromLocation = useCallback(() => {
        const lastPathSegment = location.pathname.split("/").pop();
        if (lastPathSegment === 'form') return 0;
        return steps.indexOf(lastPathSegment);
    }, [location]);

    useEffect(() => {
        if (activeStep === stepFromLocation()) return;
        setActiveStep(stepFromLocation());
    }, [location, activeStep, stepFromLocation]);

    useEffect(() => {
        if (!navigationFromSteps) return;
        if (activeStep === stepFromLocation()) return;
        navigationFromSteps && setNavigationFromSteps(false);
        navigate(`/form/${steps[activeStep]}`);
    }, [activeStep, navigate, navigationFromSteps, stepFromLocation]);

    const totalSteps = () => {
        return stepLabels.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isFirstStep = () => {
        return activeStep === 0;
    };
    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                stepLabels.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setNavigationFromSteps(true);
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setNavigationFromSteps(true);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setNavigationFromSteps(true);
        setActiveStep(step);
    };


    return (<Grid container sx={{backgroundColor: "#F8FBFF", height: "100%", paddingBottom: theme.spacing(15)}}>
        <Grid item md={3} xs={12} sx={{display: {md: 'block', sm: 'none', xs: 'none'}, pt: theme.spacing(6)}}>
            <img src={BgFormLeft} width='100%' alt=""/>
        </Grid>
        <Grid item md={6} xs={12}>
            {activeStep === 0 && <ContributionsInstructions theme={theme}/>}
            {activeStep === 1 && <NoticeInstructions theme={theme}/>}
            {activeStep === 2 && <ImagesInstructions theme={theme}/>}
            {activeStep === 3 && <EndInstructions theme={theme}/>}
            <Stepper activeStep={activeStep} alternativeLabel
                     sx={{mt: {xs: theme.spacing(4), md: theme.spacing(10)}, mx: theme.spacing(4)}}>
                {stepLabels.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <Grid container spacing={1} alignItems='center' sx={{mt: {md: theme.spacing(5), xs: theme.spacing(3)}}}>
                <Grid item xs={6} md={6} textAlign='end'>

                    <Button disabled={isFirstStep()} aria-label="Precédent" variant='outlined'
                            onClick={handleBack}>Precédent</Button>
                </Grid>
                <Grid item xs={6} md={6} textAlign='start'>
                    <Button disabled={isLastStep()} aria-label="Suivant" variant='contained'
                            onClick={handleNext}>Suivant</Button>
                </Grid>
            </Grid>
            <Grid item xs={12} textAlign='center' sx={{display: {xs: 'block', sm: 'block', md: 'none'}}}>
                <Typography pt={theme.spacing(5)}>Formulaire/{stepLabels[activeStep]}</Typography>
            </Grid>
            <Container sx={{backgroundColor: "#FFFFFF", mt: theme.spacing(5), p: theme.spacing(5)}}>
                {activeStep === 0 && <Contributions/>}
                {activeStep === 1 && <Notice/>}
                {activeStep === 2 && <Images/>}
                {activeStep === 3 && <End/>}
            </Container>
        </Grid>
        <Grid item md={3} xs={12} textAlign='center' sx={{display: {md: 'block', sm: 'none', xs: 'none'}}}>
            <Typography pt={theme.spacing(5)}>Formulaire/{stepLabels[activeStep]}</Typography>
        </Grid>

    </Grid>);
}
