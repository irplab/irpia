import React from 'react';
import {NavLink, Route, Routes} from "react-router-dom";
import {Notice} from './features/notice/Notice';
import './App.css';
import {Home} from "./features/notice/Home";
import {
    AppBar,
    Box,
    Container, createTheme,
    CssBaseline,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";

import {
    makeStyles, ThemeProvider, useTheme
} from "@mui/styles";
import {MenuOutlined} from "@mui/icons-material";


const pages = {
    'home': {path: '', label: 'Accueil'},
    'form': {path: 'form', label: 'Formulaire'},
    'about': {path: 'about', label: 'À propos'},
};

const navigationStyles = makeStyles((theme) => ({
    spacing: 5,
    navlinks: {
        marginLeft: theme.spacing(10),
        display: "flex",
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "20px",
        marginLeft: theme.spacing(5),
        "&:hover": {
            color: "yellow",
            borderBottom: "1px solid white",
        },
    }
}));


const Navigation = () => {
    const theme = useTheme();
    const classes = navigationStyles();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <> <AppBar position='sticky' xs={{marginBottom: theme.spacing(0)}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}
                    >
                        IRPIA
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuOutlined/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            <div>
                                {Object.keys(pages).map((page) => (
                                    <MenuItem key={`${page}-xs`} onClick={handleCloseNavMenu}>
                                        <NavLink to={`/${pages[page].path}`}>{pages[page].label}</NavLink>
                                    </MenuItem>
                                ))}
                            </div>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}
                    >
                        IRPIA
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}} className={classes.navlinks}>
                        {Object.keys(pages).map((page) => (
                            <NavLink key={`${page}-xs`} to={`/${pages[page].path}`}
                                     className={classes.link}>{pages[page].label}</NavLink>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
            <Toolbar/>
        </>
    );
};


function App() {
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Navigation/>
            <Container maxWidth="lg">
                <Routes>
                    <Route path="" element={<Home/>}/>
                    <Route path="form" element={<Notice/>}/>
                </Routes>
            </Container>
        </ThemeProvider>

    );
}

export default App;
