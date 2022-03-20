import {httpClient} from "../../api/api";


const fetchVocabulary = (id, hierarchy) => {
    const params = hierarchy ? {hierarchy: true} : {}
    return httpClient().get(`/vocabularies/${id}`, {params: params});
};

export {fetchVocabulary};