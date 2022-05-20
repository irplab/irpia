import React from 'react';
import {Chip, Grid, ListItem} from "@mui/material";

function DoneIcon() {
    return null;
}

export function SuggestionComponent({field, suggestions, acceptCallback, rejectCallback, titleProvider = x => x}) {
    if (!suggestions) {
        return '';
    }
    return (
        <Grid
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            {suggestions.map((suggestionId) => {
                return (
                    <ListItem key={`suggestion-${field}-${suggestionId}`}>
                        <Chip
                            color="primary"
                            variant="outlined"
                            label={titleProvider(suggestionId) || suggestionId}
                            onDelete={() => rejectCallback(suggestionId)}
                            onClick={() => acceptCallback(suggestionId)}
                            icon={<DoneIcon/>}
                        />
                    </ListItem>
                );
            })}
        </Grid>
    );
}
