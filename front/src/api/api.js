import axios from 'axios';
import applyConverters from 'axios-case-converter';

const apiV1 = applyConverters(
    axios.create({
        baseURL: `${process.env.REACT_APP_IRPIA_API_URL}/api/v1`
    }),
);

export {apiV1};
