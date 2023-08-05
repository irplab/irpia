import {apiV1} from "../api/api";

const sendAuth = (login, password) => apiV1.post(`/auth`, {login, password});


export {sendAuth};