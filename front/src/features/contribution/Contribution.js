import React, {useCallback} from 'react';
import {Button, Card, CardActions, CardContent, Typography, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {deleteContributorById, selectContributorById, updateContributorById} from "./contributorsSlice";
import {useConfirm} from "material-ui-confirm";


export function Contribution({contributorId}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const confirm = useConfirm();


    const contributor = useSelector(state => selectContributorById(state, contributorId))

    const handleDelete = useCallback(() => {
        confirm({title: 'Confirmation', description: 'Voulez-vous supprimer cette contribution ?'})
            .then(() => {
                dispatch(deleteContributorById({contributor}))
            });
    }, [contributor, confirm, dispatch]);

    return (<Card sx={{marginTop: theme.spacing(2), bgcolor: theme.palette.primary.main}} >
        <CardContent sx={{background: theme.palette.primary}}>
            <Typography sx={{fontSize: 14}} color={theme.palette.primary.contrastText} gutterBottom>
                {contributor.contributorRoleLabel}
            </Typography>
            <Typography variant="h5" component="div" color={theme.palette.primary.contrastText}>
                {contributor.editorialBrand}
            </Typography>
            <Typography sx={{mb: 1.5}} color={theme.palette.primary.contrastText}>
                {contributor.contributorName}
            </Typography>
            <Typography variant="body2" color={theme.palette.primary.contrastText}>
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
            <Button size="small" variant='text' color="error" onClick={handleDelete}
                    sx={{color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                        }}}>Supprimer</Button>
            <Button size="small" variant='outlined'
                    sx={{bgcolor: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                        },}}
                    onClick={() => dispatch(updateContributorById({
                contributor: {
                    ...contributor,
                    edited: true
                }
            }))}>Modifier</Button>

        </CardActions>
    </Card>);
}
