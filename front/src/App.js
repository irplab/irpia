import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Notice} from './features/notice/Notice';
import './App.css';
import {Home} from "./features/notice/Home";
import {HeaderLink} from "./features/notice/HeaderLink";

const Navigation = () => {
    return (
        <nav className="flex flex-col justify-between flex-wrap bg-white fixed w-full z-10 top-0">
            <div className="container mx-auto bg-white">
                <div className="flex flex-col items-start flex-shrink-0 text-pink-600 mr-6 p-6">
                    <a className="no-underline hover:text-black  hover:no-underline" href="/">
                        <span className="text-2xl pl-2 font-bold"><i className="em em-grinning"></i> IRPIA</span>
                    </a>
                    <p className='pl-2'>Indexation de ressources pédagogiques intelligente et assistée</p>
                </div>
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

            <div className="bg-black w-full flex-grow lg:flex items-center p-4"
                 id="nav-content">
                <div className="container mx-auto">
                    <ul className="list-reset lg:flex flex-1 items-center">
                        <HeaderLink path='' label='Accueil'/>
                        <HeaderLink path='form' label='Formulaire'/>
                        <HeaderLink path='about' label='À propos'/>
                    </ul>
                </div>
            </div>
        </nav>
    );
};


function App() {
    return (
        <>
            <div className="container shadow-lg mx-auto bg-white mt-24 md:mt-18">
                <Routes>
                    <Route path="" element={<Home/>}/>
                    <Route path="form" element={<Notice/>}/>
                </Routes>
            </div>
            <Navigation/>
        </>

    );
}

export default App;
