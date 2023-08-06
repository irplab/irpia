import {apiV1} from "../api/api";

const sendAuth = (login, password) => apiV1.post(`/login`, {user: {email: login, password}});
const sendLogout = () => {
    
    // console.log(store.session)
    return apiV1.delete(`/logout`);
};


export {sendAuth, sendLogout};