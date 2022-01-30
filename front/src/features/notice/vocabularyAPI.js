import {apiV1} from "../../api/api";


const fetchVocabulary = (id) => apiV1.get(`/vocabularies/${id}`,);

export {fetchVocabulary};