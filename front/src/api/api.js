import axios from 'axios';
import applyConverters from 'axios-case-converter';

const httpClient = () => axios.create({
    withCredentials: true,
    baseURL: `${process.env.REACT_APP_IRPIA_API_URL}/api/v1`
});

const apiV1 = applyConverters(
    httpClient(),
);

export {apiV1, httpClient};
