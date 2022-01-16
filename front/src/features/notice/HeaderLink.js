import React from 'react';
import {NavLink} from "react-router-dom";

export const HeaderLink = ({path, label}) => (
    <li className="mr-3">
        <NavLink
            className={({ isActive }) => {
                return isActive ? 'inline-block no-underline font-bold text-white py-2 px-4' : 'inline-block no-underline text-gray-200 hover:text-lime-100 hover:text-underline py-2 px-4';
            }
            }
            to={`/${path}`}>{label}</NavLink>
    </li>
);
