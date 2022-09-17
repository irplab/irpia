import React from 'react';
import {Route, Routes} from "react-router-dom";
import './App.css';
import {Home} from "./features/home/Home";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

import {Navigation} from "./commons/Navigation";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Form} from "./features/form/Form";
import {ConfirmProvider} from "material-ui-confirm";
import {About} from "./features/about/About";


function App() {
    const theme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#b52168',
                dark: '#80003e',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#619afc',
                light: '#99caff',
                dark: '#186cc8',
            },
            info: {
                main: '#18ffff',
                light: '#76ffff',
                dark: '#00cbcc',
            },
        },
        typography: {
            h2: {
                lineHeight: 1,
                fontWeight: '500',
                fontSize: "3rem",
            },
            h3: {
                lineHeight: 1,
                fontWeight: '500',
                fontSize: "3rem",
            },
            h4: {
                lineHeight: 1,
                fontWeight: '500',
                fontSize: "2rem",
            },
            subtitle1: {
                fontSize: "1.2rem",
            },
            subtitle2: {
                fontWeight: '400',
                fontSize: "1.2rem",
            }
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <ConfirmProvider>
                <CssBaseline/>
                <Navigation/>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route exact path="form/contribution" element={<Form/>}/>
                    <Route exact path="form/notice" element={<Form/>}/>
                    <Route exact path="form/images" element={<Form/>}/>
                    <Route exact path="form/end" element={<Form/>}/>
                    <Route exact path="form" element={<Form/>}/>
                    <Route exact path="about" element={<About/>}/>
                </Routes>
            </ConfirmProvider>
        </ThemeProvider>

    );
}

export default App;
