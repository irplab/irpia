import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Notice} from './features/notice/Notice';
import './App.css';
import {Home} from "./features/notice/Home";
import {HeaderLink} from "./features/notice/HeaderLink";

const Navigation = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6 fixed w-full z-10 top-0">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <a className="text-white no-underline hover:text-white hover:no-underline" href="/">
                    <span className="text-2xl pl-2"><i className="em em-grinning"></i> IRPIA</span>
                </a>
            </div>

            <div className="block lg:hidden">
                <button id="nav-toggle"
                        className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                    </svg>
                </button>
            </div>

            <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block pt-6 lg:pt-0"
                 id="nav-content">
                <ul className="list-reset lg:flex justify-end flex-1 items-center">
                    <HeaderLink path='home' label='Accueil'/>
                    <HeaderLink path='form' label='Formulaire'/>
                    <HeaderLink path='about' label='À propos'/>
                </ul>
            </div>
        </nav>
    );
};


function App() {
    return (
        <>
            <div className="container shadow-lg mx-auto bg-white mt-24 md:mt-18">
                <Routes>
                    <Route path="home" element={<Home/>}/>
                    <Route path="form" element={<Notice/>}/>
                </Routes>
            </div>
            <Navigation/>
        </>

    );
}

export default App;
