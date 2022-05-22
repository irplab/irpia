import React, {useCallback, useMemo} from 'react';
import {Button, Card, CardActions, CardContent, Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {deleteContributorById, selectContributorById, updateContributorById} from "./contributorsSlice";
import {useConfirm} from "material-ui-confirm";


export function Contribution({contributorId}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const confirm = useConfirm();


    const contributor = useSelector(state => selectContributorById(state, contributorId))

    const handleDelete = useCallback((e, t) => {
        confirm({title: 'Confirmation', description: 'Voulez-vous supprimer cette contribution'})
            .then(() => {
                dispatch(deleteContributorById({contributor}))
            });
    }, [contributor]);

    return (<Card sx={{marginTop: theme.spacing(2)}}>
        <CardContent>
            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                {contributor.contributorRoleLabel}
            </Typography>
            <Typography variant="h5" component="div">
                {contributor.editorialBrand}
            </Typography>
            <Typography sx={{mb: 1.5}} color="text.secondary">
                {contributor.contributorName}
            </Typography>
            <Typography variant="body2">
                ISNI : {contributor.customIsni || contributor.selectedIsniInfo?.identifier}
                <br/>
                SIREN : {contributor.customSiren || contributor.selectedSirenInfo?.identifier}
                <br/>
                {contributor.contributorPhoneNumber}
            </Typography>
        </CardContent>
        <CardActions sx={{
            display: "flex",
            justifyContent: "flex-end"
        }}>
            <Button size="small" onClick={() => dispatch(updateContributorById({
                contributor: {
                    ...contributor,
                    edited: true
                }
            }))}>Modifier</Button>
            <Button size="small" onClick={handleDelete}>Supprimer</Button>

        </CardActions>
    </Card>);
}
