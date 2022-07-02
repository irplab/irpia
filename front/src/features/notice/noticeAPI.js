import {apiV1} from "../../api/api";

const sendNotice = (notice) => apiV1.post(`/notice`, {notice: notice});

export {sendNotice};