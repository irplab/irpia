import {apiV1} from "../../api/api";

const fetchSuggestions = (notice) => apiV1.post(`/suggestions`, {notice: notice});

export {fetchSuggestions};