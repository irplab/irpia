import React, {useEffect} from "react";
import {TextField} from "@mui/material";


const InputComponent = ({inputRef, ...other}) => <div {...other} />;
const OutlinedDiv = ({children, label}) => {

    useEffect(() => console.log(label), [])
    return (
        <TextField
            variant="outlined"
            label={label}
            multiline
            InputLabelProps={{shrink: true}}
            InputProps={{
                inputComponent: InputComponent
            }}
            inputProps={{children: children}}
        />
    );
};
export default OutlinedDiv;