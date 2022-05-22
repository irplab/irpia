import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {createContributor} from "./contributorsSlice";
import {ContributionEdition} from "./ContributionEdition";
import {Contribution} from "./Contribution";
import {fetchVocabularyById, selectVocabularies} from "../notice/vocabulariesSlice";

const SIRENE_IDENTIFIER = "Sirène";

const ISNI_IDENTIFIER = "ISNI";

export function Contributions() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const contributors = useSelector((state) => state.contributors.list);
    const vocabularies = useSelector(selectVocabularies);

    useEffect(() => {
        dispatch(fetchVocabularyById({vocabularyId: '03'}))
    }, [])

    const roles = useMemo(() => {
        if (!vocabularies.entities['03-flat']) return []
        return Object.entries(vocabularies.entities['03-flat'].terms).sort((a, b) => a[1] > b[1] ? 1 : -1);
    }, [vocabularies])


    return (<>
        <Typography color="primary" variant="h4" marginBottom={theme.spacing(3)}>Contributions</Typography>
        {(contributors || []).map((contributor) => {
            return contributor.edited ?
                <ContributionEdition contributorId={contributor.id} key={contributor.id} roles={roles}/> :
                <Contribution contributorId={contributor.id} key={contributor.id}/>;
        })}
        <Button sx={{marginTop: theme.spacing(3)}} variant='outlined' onClick={() => dispatch(createContributor())}>Ajouter
            une contribution</Button>
    </>);
}
