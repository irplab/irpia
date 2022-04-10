import React from "react";
import {AppBar, Box, Container, Grid, IconButton, Menu, MenuItem, Toolbar, useTheme} from "@mui/material";
import {MenuOutlined} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import {SiteBanner} from "./SiteBanner";

export const Navigation = () => {
    const theme = useTheme();
    const pages = {
        'home': {path: '', label: 'Accueil'},
        'form': {path: 'form', label: 'Formulaire'},
        'about': {path: 'about', label: 'À propos'},
    };
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
        <>
            <SiteBanner theme={theme}/>
            <AppBar elevation={0} position='sticky' color='primary' sx={{
                marginBottom: 0,
                marginTop: {xs: 0, lg: theme.spacing(4)},
            }}>
                <Container>
                    <Toolbar disableGutters variant='dense' sx={{width: '100%', mx: 'auto', textAlign: 'right'}}>
                        <Grid container sx={{display: {xs: 'none', md: 'flex'}}}
                              justifyContent="center">
                            {Object.keys(pages).map((page) => (
                                <Grid item
                                      flexGrow={0.2}

                                      key={`${page}-xs`}>
                                    <NavLink exact='true'
                                             style={{
                                                 textDecoration: 'none',
                                                 fontWeight: '300',
                                                 color: theme.palette.primary.contrastText,
                                                 marginLeft: theme.spacing(2)
                                             }}
                                             to={`/${pages[page].path}`}>{pages[page].label}</NavLink>
                                </Grid>
                            ))}
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
                                }}
                            >
                                <div>
                                    {Object.keys(pages).map((page) => (
                                        <MenuItem key={`${page}-xs`} onClick={handleCloseNavMenu}>
                                            <NavLink style={{
                                                textDecoration: 'none',
                                                fontWeight: '300',
                                                color: theme.palette.secondary.contrastText,
                                                marginLeft: theme.spacing(2)
                                            }} to={`/${pages[page].path}`}>{pages[page].label}</NavLink>
                                        </MenuItem>
                                    ))}
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