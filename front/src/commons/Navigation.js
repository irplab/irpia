import React, {useCallback} from "react";
import {
    Alert,
    AppBar,
    Box,
    Container,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Toolbar,
    useTheme
} from "@mui/material";
import {LockOpenOutlined, LockOutlined, MenuOutlined} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import {SiteBanner} from "./SiteBanner";
import {AuthDialog} from "./AuthDialog";
import {useDispatch, useSelector} from "react-redux";
import {logout, logoutRequest} from "./authSlice";
import {unwrapResult} from "@reduxjs/toolkit";

export const Navigation = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const pages = {
        'home': {path: '', label: 'Accueil'},
        'form': {path: 'wizard', label: 'Assistant'},
        'about': {path: 'about', label: 'À propos'},
    };
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
    const [loginSuccess, setLoginSuccess] = React.useState(false);
    const [logoutSuccess, setLogoutSuccess] = React.useState(false);

    const loggedIn = useSelector((state) => state.auth.value.loggedIn);

    const handleClose = () => {
        setAuthDialogOpen(false);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const loginLogoutControl = () => {
        return <IconButton
            sx={{py: 0, color: theme.palette.primary.contrastText}}
            aria-label="déverrouiller"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
                if (!loggedIn) {
                    setAuthDialogOpen(true);
                } else {
                    dispatch(logoutRequest()).then(unwrapResult).then(() => {
                        dispatch(logout());
                        setLogoutSuccess(true);
                    }).catch((error) => {
                        console.log(error)
                    });
                }

            }}
        >
            {loggedIn ? <LockOpenOutlined/> : <LockOutlined/>}
        </IconButton>
    }

    const loginSuccessSnackbar = useCallback(() => <Snackbar open={loginSuccess} autoHideDuration={3000}
                                                             onClose={() => setLoginSuccess(false)}>
        <Alert onClose={() => setLoginSuccess(false)} severity="success" sx={{width: '100%'}}>
            Application déverrouillée. Vous avez accès aux fonctionnalités basées sur GPT.
        </Alert>
    </Snackbar>, [loginSuccess])

    const logoutSuccessSnackbar = useCallback(() => <Snackbar open={logoutSuccess} autoHideDuration={3000}
                                                              onClose={() => setLogoutSuccess(false)}>
        <Alert onClose={() => setLogoutSuccess(false)} severity="warning" sx={{width: '100%'}}>
            Application verrouillée. Vous n'avez plus accès fonctionnalités basées sur GPT.
        </Alert>
    </Snackbar>, [logoutSuccess])

    return (
        <>
            <AuthDialog open={authDialogOpen} handleClose={handleClose} handleSuccess={() => setLoginSuccess(true)}/>
            <SiteBanner theme={theme}/>
            {logoutSuccessSnackbar()}
            {loginSuccessSnackbar()}
            <AppBar elevation={0} position='sticky' color='primary' sx={{
                marginBottom: 0,
                marginTop: {xs: 0, lg: theme.spacing(1)},
            }}>
                <Container>
                    <Toolbar disableGutters variant='dense' sx={{width: '100%', mx: 'auto', textAlign: 'right'}}>
                        <Grid container sx={{display: {xs: 'none', md: 'flex'}}}
                              justifyContent="center">
                            {Object.keys(pages).map((page) => (
                                <Grid item
                                      flexGrow={0.2}
                                      textAlign='center'
                                      key={`${page}-xs`}>
                                    <NavLink exact='false'
                                             style={{
                                                 textDecoration: 'none',
                                                 fontWeight: 'normal',
                                                 textAlign: 'center',
                                                 color: theme.palette.primary.contrastText,
                                                 marginLeft: theme.spacing(2)
                                             }}
                                             to={`/${pages[page].path}`}>{pages[page].label}</NavLink>
                                </Grid>
                            ))} <Grid item
                                      flexGrow={0.2}
                                      textAlign='center'
                                      key={`auth-xs`}>
                            {loginLogoutControl()}
                        </Grid>

                        </Grid>
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
                                    "& .MuiPaper-root": {
                                        backgroundColor: theme.palette.primary.main,
                                    }
                                }}
                            >
                                <div>
                                    {Object.keys(pages).map((page) => (
                                        <MenuItem key={`${page}-xs`} onClick={handleCloseNavMenu}>
                                            <NavLink style={{
                                                textDecoration: 'none',
                                                fontWeight: '300',
                                                color: theme.palette.primary.contrastText,
                                                marginLeft: theme.spacing(2)
                                            }} to={`/${pages[page].path}`}>{pages[page].label}</NavLink>
                                        </MenuItem>
                                    ))}
                                    <MenuItem key={`auth-xs`} onClick={handleCloseNavMenu}>
                                        {loginLogoutControl()}
                                    </MenuItem>
                                </div>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar/>


        </>
    )
        ;
};