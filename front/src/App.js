import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Notice} from './features/notice/Notice';
import './App.css';
import {Home} from "./features/notice/Home";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";

import {Navigation} from "./commons/Navigation";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
    const theme = createTheme({
        palette: {
            secondary: {
                light: '#619AFC',
                main: '#385EBA',
                dark: '#212474',
                contrastText: '#000',
            },
            primary: {
                light: '#C683A4',
                main: '#B52168',
                contrastText: '#fff',
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Navigation/>
            <Routes>
                <Route exact path="" element={<Home/>}/>
                <Route exact path="form" element={<Notice/>}/>
            </Routes>
        </ThemeProvider>

    );
}

export default App;
