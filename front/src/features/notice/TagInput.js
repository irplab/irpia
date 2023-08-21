import React, {useRef} from 'react';
import {Box, Chip, Grid, TextField} from "@mui/material";
import {removeDuplicates} from "../../commons/utils";

export function TagInput({tags, onChange, loggedIn}) {
    const tagRef = useRef();
    const handleOnSubmit = (e) => {
        e.preventDefault();
        onChange(removeDuplicates([...tags, tagRef.current.value]));
        tagRef.current.value = "";
    };
    const handleDelete = (value) => {
        const newtags = tags.filter((val) => val !== value);
        console.log(newtags)
        onChange(newtags);
    };

    const Tag = ({data, handleDelete, key}) => {
        return (
            <Grid item key={key}>
                <Chip
                    size='small'
                    variant='filled'
                    color='primary'
                    label={data}
                    onDelete={() => handleDelete(data)}
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: {xs: '16rem', sm: '20rem', md: '25rem'},
                        my: '0.1rem'
                    }}
                />
            </Grid>

        );
    };

    return (<Box sx={{flexGrow: 1, width: '100%'}}>
        <Grid
            container
            justify="space-between" spacing={1}>
            {tags.map((data, index) => {
                return (<Tag data={data} handleDelete={handleDelete} key={`suggestion-tag-${index}`}/>);
            })}
        </Grid>
        <TextField
            fullWidth
            multiline={true}
            inputRef={tagRef}
            variant='standard'
            size='small'
            sx={{margin: "1rem 0"}}
            margin='none'
            placeholder={loggedIn ? "Saissez des mots clés ou acceptez des sugestions ci-dessous" : "Saisissez vos mots clés"}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleOnSubmit(e)
                }
            }}
        />

    </Box>);
}