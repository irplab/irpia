import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    assist,
    selectSuggestions,
} from './suggestionsSlice';
import styles from './Notice.module.css';

export function Notice() {
    const suggestions = useSelector(selectSuggestions);
    const dispatch = useDispatch();
    const [notice, setNotice] = useState({});

    const handleValidation = () => {
        dispatch(assist(notice));
    };
    useEffect(() => console.log(suggestions), [suggestions])

    return (
        <div className='pt-36 pb-24 px-6'>
            <form className="w-full">
                <div className="flex items-center  py-2">
                    <input
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 focus:outline-none"
                        type="text" placeholder="Tapez quelques lettres pour simuler la saisie utilisateur" aria-label="Titre"
                        value={notice.title} onChange={(e) => setNotice(e.target.value)}/>
                </div>
                <div className="flex justify-items-end py-2 hidden">
                    <button
                        className="flex-initial justify-self-end bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                        type="button"
                        onClick={handleValidation}>
                        Valider
                    </button>
                </div>
            </form>
        </div>
    );
}
