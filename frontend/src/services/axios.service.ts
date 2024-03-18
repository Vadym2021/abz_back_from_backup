import axios from "axios";
import {baseURL, urls} from "../constants";
import Cookies from "js-cookie";

export const axiosService = axios.create({baseURL})

axiosService.interceptors.request.use(request => {
    if (request.url && request.url === urls.register) {
        const token = Cookies.get('token');
        if (token) {
            request.headers.Authorization = `${token}`;
        }
    }
    return request;
});
