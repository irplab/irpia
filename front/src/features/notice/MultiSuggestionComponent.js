import React, {useState} from 'react';
import {Box, Button, Chip, Grid, ListItem, useTheme} from "@mui/material";
import OutlinedDiv from "../../commons/OutlinedDiv";

function DoneIcon() {
    return null;
}

export function MultiSuggestionComponent({label, field, suggestions, acceptCallback, rejectCallback, titleProvider = x => x}) {
    const theme = useTheme();

    const [selectedSuggestions, setSelectedSuggestions] = useState([])


    if (!suggestions || suggestions.length===0) {
        return '';
    }

    const toggleSelection = (suggestionId) => {
        const index = selectedSuggestions.findIndex(x => x == suggestionId)
        if (index === -1) {
            setSelectedSuggestions(selectedSuggestions.concat(suggestionId));
        } else {
            setSelectedSuggestions(selectedSuggestions.filter((elem) => elem !== suggestionId));
        }
    }

    return (
        <div className='suggestions-section'><Grid
            sx={{
                display: 'flex',
                justifyContent: 'left',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            className="suggestions-container"
            justify="space-between"
            container
            component="ul"
            spacing={theme.spacing(1)}
        >
            <Box
                sx={{
                    paddingTop: 0.5,
                    paddingBottom: 0,
                    px: 2,
                    color: '#ffffff',
                    lineHeight: 2.2,
                    backgroundColor: 'primary.main',
                    margin: -0.5
                }}
            >Suggestions Irpia</Box>
            {suggestions?.map((suggestionId) => {
                return (
                    <Grid component='li' item key={`suggestion-${field}-${suggestionId}`}>
                        <Chip
                            color={selectedSuggestions.indexOf(suggestionId) >= 0 ? "primary" : "default"}
                            label={titleProvider(suggestionId) || suggestionId}
                            onClick={() => toggleSelection(suggestionId)}
                            icon={<DoneIcon/>}
                        />
                    </Grid>
                );
            })}
        </Grid>
            <Grid container direction='row'
                  paddingTop={2}
                  className="suggestions-buttons-container"
                  spacing={theme.spacing(2)}
                  justifyContent="center">
                <Grid item><Button variant='outlined' disabled={selectedSuggestions.length === 0}
                                   onClick={() => acceptCallback(selectedSuggestions)}>Accepter la
                    sélection</Button></Grid>
                <Grid item><Button variant='contained'
                                   disabled={suggestions.length === 0}
                                   onClick={() => acceptCallback(suggestions)}>Accepter tout</Button></Grid>
            </Grid>
        </div>
    );
}
