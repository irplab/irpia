import React, {useEffect} from 'react';
import {Button, Container, Grid, Step, StepButton, Stepper, Typography, useTheme} from "@mui/material";
import BgFormLeft from '../../graphics/bg_form_left.svg';
import {useLocation, useNavigate} from "react-router-dom";
import {Notice} from "../notice/Notice";
import {Contribution} from "../contribution/Contribution";
import {End} from "../end/End";


const steps = ['contribution', 'notice', 'end'];
const stepLabels = ['Contribution', 'Notice', 'Terminé !'];

export function Form() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeStep, setActiveStep] = React.useState(0);

    const [navigationFromSteps, setNavigationFromSteps] = React.useState(false);

    const [completed, setCompleted] = React.useState({});

    const stepFromLocation = () => steps.indexOf(location.pathname.split("/").pop());

    useEffect(() => {
        if (activeStep === stepFromLocation()) return;
        setActiveStep(stepFromLocation());
    }, [location]);

    useEffect(() => {
        if (!navigationFromSteps) return;
        if (activeStep === stepFromLocation()) return;
        setNavigationFromSteps(false);
        navigate(`/form/${steps[activeStep]}`);
    }, [activeStep]);

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


    return (<Grid container sx={{backgroundColor: "#F8FBFF", height: "100%"}}>
        <Grid item md={3} xs={12} sx={{display: {md: 'block', sm: 'none', xs: 'none'}, pt: theme.spacing(6)}}>
            <img src={BgFormLeft} width='100%' sx={{textAlign: 'center'}}/>
        </Grid>
        <Grid item md={6} xs={12}>
            <Typography variant='h4' color="secondary" align='center' sx={{mt: theme.spacing(5), mx: theme.spacing(4)}}>Lorem
                ipsum dolor sit amet</Typography>
            <Typography variant='subtitle2' align='center' sx={{mt: theme.spacing(2), mx: theme.spacing(4)}}>Petite
                introduction indiquant de quels documents l'utilisateur doit
                se munir, etc.</Typography>
            <Stepper activeStep={activeStep}
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
                {activeStep === 0 && <Contribution/>}
                {activeStep === 1 && <Notice/>}
                {activeStep === 2 && <End/>}
            </Container>
        </Grid>
        <Grid item md={3} xs={12} textAlign='center' sx={{display: {md: 'block', sm: 'none', xs: 'none'}}}>
            <Typography pt={theme.spacing(5)}>Formulaire/{stepLabels[activeStep]}</Typography>
        </Grid>

    </Grid>);
}
