import {httpClient} from "../../api/api";


const fetchVocabulary = (id) => httpClient().get(`/vocabularies/${id}`,);

export {fetchVocabulary};