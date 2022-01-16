import React from 'react';
import {CogIcon, DocumentSearchIcon, DocumentTextIcon, PhotographIcon} from "@heroicons/react/solid";

export function Home() {

    return (
        <div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
            <div className="flex flex-col w-full lg:w-1/2 justify-center items-start pt-12 pb-24 px-6">
                <p className="leading-normal mb-4 lg:mt-24 sm:mt-24">IRPI est un prototype de formulaire de saisie de métadonnées
                    de
                    ressources pédagogiques
                    offrant à l'utilisateur des fonctionnalités d'assistance intelligentes telles que :
                    <ul className='ml-9 hover:divide-gray-100 divide-y-2 divide-white'>
                        <li className='flex items-center pb-3 pt-3 cursor-pointer hover:bg-gray-200 cursor-pointer hover:bg-lime-200'>
                            <DocumentTextIcon className='w-9 h-9 mr-5 fill-cyan-800'/>
                            Classification automatique basée sur le contenu
                        </li>
                        <li className='flex items-center pb-3 pt-3 cursor-pointer hover:bg-gray-200'>
                            <CogIcon className='w-9 h-9 mr-5 fill-cyan-800'/>
                            Extraction automatique de métadonnées
                        </li>
                        <li className='flex items-center pb-3 pt-3 cursor-pointer hover:bg-gray-200'>
                            <DocumentSearchIcon className='w-9 h-9 mr-5 fill-cyan-800'/>
                            Recherche automatisée dans les nomenclatures et programmes
                        </li>
                        <li className='flex items-center pb-3 pt-3 cursor-pointer hover:bg-gray-200'>
                            <PhotographIcon className='w-9 h-9 mr-5 fill-cyan-800'/>
                            Suggestion de miniatures
                        </li>
                    </ul></p>
                <div className='flex flex-row justify-end w-full'>
                    <a href='/form'>
                        <button
                            className="bg-transparent hover:bg-black text-black hover:text-white rounded shadow hover:shadow-lg py-2 px-4 border border-black hover:border-transparent">
                            Décrire une ressource
                        </button>
                    </a>
                </div>
            </div>
            <div className="w-full sm:w-2/3 sm:ml-10 lg:w-1/3 lg:py-6 text-center lg:pl-16">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 168.000000 60.000000"
                     className='object-cover'
                     preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,60.000000) scale(0.100000,-0.100000)"
                       fill="#000000" stroke="none">
                        <path className='fill-pink-600' d="M885 572 c-198 -13 -361 -26 -363 -27 -3 -3 27 -473 31 -488 1 -5 22
21 46 57 24 36 48 66 55 66 6 -1 161 9 345 22 l334 22 -7 106 c-4 58 -9 142
-13 188 l-6 82 -31 -1 c-17 -1 -193 -13 -391 -27z m44 -67 c39 -20 54 -63 49
-136 -4 -52 -9 -66 -32 -86 -78 -67 -161 15 -142 140 8 49 23 73 57 86 33 13
36 13 68 -4z m-237 -92 l3 -98 43 -3 c34 -3 42 -7 42 -23 0 -17 -7 -19 -70
-19 l-70 0 0 120 0 120 25 0 c24 0 24 -1 27 -97z m406 35 l19 -61 20 59 c16
49 24 59 45 62 25 3 25 2 31 -89 11 -148 11 -149 -18 -149 -24 0 -25 2 -26 73
l-1 72 -16 -47 c-12 -38 -20 -48 -38 -48 -17 0 -23 8 -29 37 -9 49 -25 25 -25
-39 0 -41 -3 -48 -20 -48 -18 0 -20 7 -20 83 0 124 8 157 36 157 20 0 26 -9
42 -62z"/>
                        <path className='fill-pink-600' d="M866 455 c-11 -30 -6 -121 8 -140 12 -16 16 -17 29 -6 20 16 30 86
19 126 -9 34 -45 47 -56 20z"/>
                        <path d="M27 492 c-35 -39 -18 -86 43 -117 34 -17 47 -50 29 -71 -10 -12 -23
-14 -57 -9 -56 8 -54 -15 2 -29 31 -7 43 -5 64 11 51 38 41 90 -23 127 -47 28
-57 53 -30 76 11 9 22 9 45 1 28 -9 31 -8 28 7 -5 26 -79 29 -101 4z"/>
                        <path d="M1390 390 c0 -100 3 -120 15 -120 12 0 15 13 15 55 l0 55 35 0 c24 0
35 5 35 15 0 10 -11 15 -35 15 -33 0 -35 2 -35 34 0 34 1 35 42 38 23 2 43 9
46 16 3 9 -13 12 -57 12 l-61 0 0 -120z"/>
                        <path d="M1540 390 c0 -100 3 -120 15 -120 12 0 15 13 15 55 0 30 4 55 10 55
5 0 23 -27 40 -60 22 -43 34 -58 45 -54 13 5 11 15 -14 60 -28 51 -28 54 -10
66 10 7 22 27 25 44 9 46 -22 74 -81 74 l-45 0 0 -120z m90 75 c20 -24 -3 -65
-35 -65 -23 0 -25 4 -25 40 0 35 3 40 24 40 13 0 29 -7 36 -15z"/>
                        <path d="M198 423 c-58 -67 -16 -175 62 -158 42 9 41 37 -2 28 -23 -5 -34 -2
-45 12 -19 27 -16 69 6 96 17 21 22 22 40 12 26 -16 31 -16 31 1 0 29 -68 36
-92 9z"/>
                        <path d="M354 432 c-20 -13 -34 -50 -34 -87 0 -41 36 -85 70 -85 34 0 70 44
70 85 0 61 -25 95 -70 95 -14 0 -30 -4 -36 -8z m61 -28 c21 -22 17 -93 -7
-108 -27 -17 -52 4 -56 47 -6 65 27 96 63 61z"/>
                    </g>
                </svg>
            </div>
        </div>
    );
}
