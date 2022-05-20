import {apiV1} from "../../api/api";

const getContributors = (name) => apiV1.post(`/contributors`, {name: name});

export {getContributors};