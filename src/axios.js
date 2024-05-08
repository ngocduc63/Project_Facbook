import axios from 'axios';
import { LINK_API } from './api/const';
const BASE_URL = LINK_API;

export default axios.create({
    baseURL: BASE_URL,
});

export const makeRequest = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});
