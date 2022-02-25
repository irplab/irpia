import React from 'react';
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/solid";

export function SuggestionComponent({suggestions, acceptCallback, titleProvider = x => x}) {
    if (!suggestions) {
        return '';
    }
    return (
        <div className='flex flex-row'>
            {suggestions.map((suggestionId) => {
                return (
                    <div
                        className="cursor-pointer flex flex-row align-middle bg-blue-100 border border-blue-400-400 text-blue-700 px-4 py-3 ml-6 rounded relative transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300"
                        role="alert">
                        <span className='py-0'>{titleProvider(suggestionId)}</span>
                        <span className="px-0 py-0 align-top ml-2 ">
                            <CheckCircleIcon className='w-6 h-6 fill-green-800 cursor-pointer hover:fill-cyan-400'
                                             onClick={() => acceptCallback(suggestionId)}/>
                        </span>
                        <span className="px-0 py-0 align-top ">
                            <XCircleIcon className='w-6 h-6 fill-red-800 cursor-pointer hover:fill-red-400'/>
                        </span>
                    </div>
                )
            })}
        </div>
    );
}
