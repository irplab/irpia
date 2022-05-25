import React from 'react';
import {Box, Chip, Grid, ListItem, useTheme} from "@mui/material";

function DoneIcon() {
    return null;
}

export function SuggestionComponent({field, suggestions, acceptCallback, rejectCallback, titleProvider = x => x}) {
    const theme = useTheme();
    if (!suggestions || suggestions.length===0) {
        return '';
    }
    return (
        <div className='suggestions-section'>

            <Grid
                sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}
                container
                justify="space-between"
                component="ul"
                spacing={theme.spacing(1)}
            ><Box
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
                {suggestions.map((suggestionId) => {
                    return (
                        <Grid item component='li' key={`suggestion-${field}-${suggestionId}`}>
                            <Chip
                                color="primary"
                                variant="outlined"
                                label={titleProvider(suggestionId) || suggestionId}
                                onDelete={() => rejectCallback(suggestionId)}
                                onClick={() => acceptCallback(suggestionId)}
                                icon={<DoneIcon/>}
                            />
                        </Grid>
                    );
                })}
            </Grid></div>
    );
}
