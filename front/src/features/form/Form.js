import React, {useCallback, useEffect} from 'react';
import {Button, Container, Grid, Step, StepButton, Stepper, Typography, useTheme} from "@mui/material";
import BgFormLeft from '../../graphics/bg_form_left.svg';
import {useLocation, useNavigate} from "react-router-dom";
import {Notice} from "../notice/Notice";
import {Contributions} from "../contribution/Contributions";
import {End} from "../end/End";
import {Images} from "../images/Images";


const steps = ['description', 'contributions', 'thumbnail', 'end'];
const stepLabels = ['Description', 'Contributions', 'Illustration', 'Terminé !'];

const Instructions = props => <>
    <Typography variant="h2" color="secondary" align="center" fontSize={42}
                sx={{mt: props.theme.spacing(5), mx: props.theme.spacing(4)}}>Assistant
        d’indexation intelligent <br/> {props.title}</Typography>
    <Typography variant="subtitle2" align="center" sx={{
        mt: props.theme.spacing(6),
        mx: props.theme.spacing(8),
        lineHeight: 1.3
    }}>{props.children}</Typography>
</>;
const ContributionsInstructions = props => <Instructions theme={props.theme} title="Contributions">
    Munissez-vous
    du nom des personnes morales ou physiques ayant contribué à la réalisation de la ressource pédagogique à
    indexer.
    L’assistant IRPIA, à partir du nom du contributeur, vous aidera à compléter le numéro de SIREN, le numéro
    ISNI, le nom et la marque éditoriale.
</Instructions>;

const NoticeInstructions = props => <Instructions theme={props.theme} title="Description">Saisissez
    l’adresse URL de la ressource pédagogique que vous souhaitez indexer.
    L’assistant IRPIA, vous proposera des suggestions pour compléter le titre, la description, les domaines
    d’enseignement et les niveaux éducatifs. Une fois sélectionnés, vous pourrez les modifier.
</Instructions>;

const ImagesInstructions = props => <Instructions theme={props.theme} title="Illustration">Choisissez
    une image proposée par l’assistant IRPIA afin d’illustrer la ressource pédagogique. <br/>
    <br/>
    <br/>
    <br/>
</Instructions>;

const EndInstructions = props => <Instructions theme={props.theme} title="Téléchargement">
    Vous avez terminé ! Maintenant, vous pouvez télécharger la notice que vous avez crée conforme au ScoLOMFR au
    format XML.
    Vous pouvez aussi initier une nouvelle notice avec les mêmes contributeurs ou réinitialiser le formulaire.
</Instructions>;

function StepControl(props) {
    return <Grid container spacing={1} alignItems="center"
                 sx={{mt: {md: props.theme.spacing(5), xs: props.theme.spacing(3)}}}>
        <Grid item xs={6} md={6} textAlign="end">

            <Button disabled={props.prevDisabled} aria-label="Precédent" variant="outlined"
                    onClick={props.onClick}>Precédent</Button>
        </Grid>
        <Grid item xs={6} md={6} textAlign="start">
            <Button disabled={props.nextDisabled} aria-label="Suivant" variant="contained"
                    onClick={props.onClick1}>Suivant</Button>
        </Grid>
    </Grid>;
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
        if (lastPathSegment === 'wizard') return 0;
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
        navigate(`/wizard/${steps[activeStep]}`);
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
        <Grid item md={6} xs={12} mt={8}>
            {activeStep === 0 && <NoticeInstructions theme={theme}/>}
            {activeStep === 1 && <ContributionsInstructions theme={theme}/>}
            {activeStep === 2 && <ImagesInstructions theme={theme}/>}
            {activeStep === 3 && <EndInstructions theme={theme}/>}
            <Stepper activeStep={activeStep} alternativeLabel nonLinear
                     sx={{mt: {xs: theme.spacing(4), md: theme.spacing(10)}, mx: theme.spacing(4)}}>
                {stepLabels.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <StepControl theme={theme} prevDisabled={isFirstStep()} onClick={handleBack} nextDisabled={isLastStep()}
                         onClick1={handleNext}/>
            <Grid item xs={12} textAlign='center' sx={{display: {xs: 'block', sm: 'block', md: 'none'}}}>
                <Typography pt={theme.spacing(5)}
                            fontSize="small">Formulaire&nbsp;/&nbsp;{stepLabels[activeStep]}</Typography>
            </Grid>
            <Container sx={{backgroundColor: "#FFFFFF", mt: theme.spacing(5), p: theme.spacing(5)}}>
                {activeStep === 0 && <Notice/>}
                {activeStep === 1 && <Contributions/>}
                {activeStep === 2 && <Images/>}
                {activeStep === 3 && <End/>}
                <StepControl theme={theme} prevDisabled={isFirstStep()} onClick={handleBack} nextDisabled={isLastStep()}
                             onClick1={handleNext}/>
            </Container>
        </Grid>
        <Grid item md={3} xs={12} textAlign='center' sx={{display: {md: 'block', sm: 'none', xs: 'none'}}}>
            <Typography pt={theme.spacing(5)} fontSize={14}>Assistant&nbsp;/&nbsp;{stepLabels[activeStep]}</Typography>
        </Grid>

    </Grid>);
}
