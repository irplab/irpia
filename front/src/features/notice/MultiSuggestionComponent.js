import React, {useState} from 'react';
import {Box, Button, Chip, Grid, useTheme} from "@mui/material";

function DoneIcon() {
    return null;
}

export function MultiSuggestionComponent({
                                             field,
                                             suggestions,
                                             acceptCallback,
                                             titleProvider = x => x
                                         }) {
    const theme = useTheme();

    const [selectedSuggestions, setSelectedSuggestions] = useState([])


    if (!suggestions || suggestions.length === 0) {
        return '';
    }

    const toggleSelection = (suggestionId) => {
        const index = selectedSuggestions.findIndex(x => x === suggestionId)
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
                mt: 2
            }}
            className="suggestions-container"
            justify="space-between"
            container
            component="ul"
            spacing={theme.spacing(1)}
        >
            <Box
                sx={{

                    fontSize: "14px",
                    width: '100%',
                    paddingTop: 0,
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
                            size='small'
                            variant={selectedSuggestions.indexOf(suggestionId) >= 0 ? "filled" : "outlined"}
                            color='primary'
                            label={titleProvider(suggestionId) || suggestionId}
                            onClick={() => toggleSelection(suggestionId)}
                            icon={<DoneIcon/>}
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: {xs: '16rem', sm: '20rem', md: '100%'},
                            }}
                        />
                    </Grid>
                );
            })}
        </Grid>
            <Grid container direction='row'
                  paddingTop={2}
                  className="suggestions-buttons-container"
                  spacing={theme.spacing(2)}
                  justifyContent="end">
                <Grid item><Button variant='outlined' disabled={selectedSuggestions.length === 0}
                                   size="small"
                                   onClick={() => acceptCallback(selectedSuggestions)}>Accepter la
                    sélection</Button></Grid>
                <Grid item><Button variant='contained'
                                   size="small"
                                   disabled={suggestions.length === 0}
                                   onClick={() => acceptCallback(suggestions)}>Accepter tout</Button></Grid>
            </Grid>
        </div>
    );
}
