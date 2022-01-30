import {apiV1} from "../../api/api";

const createSuggestion = (notice) => apiV1.post(`/suggestions`, {notice: notice});

const fetchSuggestion = (id, timestamp) => apiV1.get(`/suggestions/${id}`, {params: {timestamp}});

export {createSuggestion, fetchSuggestion};