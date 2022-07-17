import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, AlertTitle, Box, Grid, Paper, TextField, Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {suggestionsSelectors} from "../notice/suggestionsSlice";
import Gallery from "react-photo-gallery";
import SelectedImage from "./SelectedImage";
import Image from "mui-image";
import {updateField} from "../notice/noticeSlice";

export function Images() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const notice = useSelector((state) => state.notice.value);
    const [selectedImageUrl, setSelectedImageUrl] = useState(undefined);
    const [inputImageUrl, setInputImageUrl] = useState(undefined);
    const [invalidInputImageUrl, setInvalidInputImageUrl] = useState(false);
    const [inputImageUrlErrror, setInputImageUrlError] = useState(false);

    const imageSuggestions = useSelector((state) => {
        return suggestionsSelectors.selectAll(state.suggestions)?.at(-1)?.suggestions?.images;
    });

    const isValidUrl = (url) => {
        try {
            new URL(url);
        } catch (e) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!inputImageUrl && !selectedImageUrl) return;
        dispatch(updateField({thumbnailUrl: inputImageUrl || selectedImageUrl}));
    }, [selectedImageUrl, inputImageUrl, dispatch])

    const imageRenderer = useCallback(({index, left, top, key, photo}) => {
        return <SelectedImage
            handleOnClick={(imageUrl) => {
                setSelectedImageUrl(imageUrl);
                setInputImageUrl(undefined);
            }}
            key={key}
            selected={key === selectedImageUrl}
            margin={"2px"}
            index={index}
            image={photo}
            left={left}
            top={top}
        />
    }, [selectedImageUrl]);

    const gcd = useCallback((a, b) => {
        if (b === 0) return a;
        return gcd(b, a % b)
    }, []);

    const onError = () => {
        setInputImageUrlError(true);
    }


    const images = useMemo(() => {
        return imageSuggestions?.map((frozenObject) => JSON.parse(JSON.stringify(frozenObject))).map((suggestion) => {
            const r = gcd(suggestion.width, suggestion.height);
            suggestion.width = suggestion.width / r;
            suggestion.height = suggestion.height / r;
            return suggestion;
        })
    }, [imageSuggestions, gcd]);

    useEffect(() => console.log(imageSuggestions), [imageSuggestions])

    return (<Grid container spacing={4} direction="column" sx={{height: "100%", flexWrap: "nowrap"}}>
        <Grid item>
            <TextField
                error={invalidInputImageUrl}
                fullWidth
                id="image-url-field"
                label="URL de votre vignette"
                onChange={(e) => {
                    const url = e.target.value;
                    setInvalidInputImageUrl(url && !isValidUrl(url))
                    setInputImageUrlError(false);
                    setInputImageUrl(url);
                    setSelectedImageUrl(undefined);
                }}
                value={notice.thumbnailUrl}
                InputLabelProps={{shrink: !!notice.thumbnailUrl}}
                helperText={invalidInputImageUrl ? "Veuillez vérifier votre URL" : (selectedImageUrl ? "URL de la vignette que vous avez sélectionnée" : (inputImageUrl ? "URL de votre vignette personnalisée" : "Veuillez saisir une URL valide commençant par http:// ou https://"))}
            /></Grid>
        <Grid item sx={{flexWrap: "no-wrap"}}>
            <Grid container direction='row' spacing={4}>
                <Grid item md={8} xs={12}>
                    {!imageSuggestions && !selectedImageUrl && !inputImageUrl &&
                        <Alert severity="warning">
                            <AlertTitle>Pas de suggestion</AlertTitle>Vous n'avez aucune suggestion d'image. Saisissez
                            l'URL de votre
                            vignette ou
                            retournez à l'étape 2 et entrez l'URL de votre ressource</Alert>}
                    {imageSuggestions && !selectedImageUrl && !inputImageUrl &&
                        <Alert variant="outlined" severity="info" sx={{mb: theme.spacing(1)}}>
                            <AlertTitle>Veuillez choisir une vignette</AlertTitle>Sélectionnez une
                            vignette
                            parmi les
                            suggestions ou
                            saisissez l'URL de votre
                            vignette </Alert>}
                    {inputImageUrl && !inputImageUrlErrror &&
                        <Alert variant="outlined" severity="success" sx={{mb: theme.spacing(1), fontSize: "xl"}}>
                            <AlertTitle>Vignette personnalisée</AlertTitle>
                            Voici la vignette
                            correspondant à l'URL que vous avez saisie.</Alert>}
                    {inputImageUrl && inputImageUrlErrror &&
                        <Alert variant="outlined" severity="error" sx={{mb: theme.spacing(1), fontSize: "xl"}}>
                            <AlertTitle>URL erronée</AlertTitle>
                            L'URL de la vignette personnalisée que vous avez saisie ne correspond pas à une image
                            valide..</Alert>}
                    {selectedImageUrl &&
                        <Alert variant="outlined" severity="success" sx={{mb: theme.spacing(1), fontSize: "xl"}}>
                            <AlertTitle>Vignette sélectionnée</AlertTitle>
                            Voici la vignette que vous avez sélectionnée parmi les suggestions IRPIA.</Alert>}
                </Grid>
                <Grid item md={4} xs={12} component={Box}><Paper elevation={7}>
                    {(inputImageUrl || selectedImageUrl) && <Image showLoading onError={onError} duration={2000}
                                                                   src={inputImageUrl || selectedImageUrl}/>}
                </Paper></Grid>
            </Grid>
        </Grid>
        {imageSuggestions &&
            <><Grid item>
                <Typography>Pour gagner du temps, vous pouvez sélectionner une des vignettes qu'IRPIA a découvertes sur
                    la
                    page de votre ressource :</Typography>
            </Grid>
                <Grid item>
                    <Gallery direction="row"
                             renderImage={imageRenderer}
                             photos={images}/>
                </Grid></>}
    </Grid>);
}
