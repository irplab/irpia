import React, {useEffect} from 'react';
import {Button, Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {createContributor} from "./contributorsSlice";
import {ContributionEdition} from "./ContributionEdition";
import {Contribution} from "./Contribution";

const SIRENE_IDENTIFIER = "Sirène";

const ISNI_IDENTIFIER = "ISNI";

export function Contributions() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const contributors = useSelector((state) => state.contributors.list);

    useEffect(() => {
        console.log(contributors)
    }, [contributors])


    return (<>
        <Typography color="primary" variant="h4" marginBottom={theme.spacing(3)}>Contributions</Typography>
        {(contributors || []).map((contributor) => {
            return contributor.edited ? <ContributionEdition contributorId={contributor.id} key={contributor.id}/> :
                <Contribution contributorId={contributor.id} key={contributor.id}/>;
        })}
        <Button onClick={() => dispatch(createContributor())}>Nouveau contributeur</Button>
    </>);
}
