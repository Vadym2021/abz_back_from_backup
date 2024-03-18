import {urls} from "../constants";
import {IUser, IToken, IPositionsResponse, IPositions, IUserSingle, IUserSingleResponse} from "../interfaces";
import {axiosService} from "./axios.service";
import {IRes} from "../types";
import {IPage} from "../interfaces/page.interface";

class ApiService {
    getToken(): IRes<IToken> {
        return axiosService.get(urls.token)
    };

    register(formData: FormData): IRes<IUser> {
        return axiosService.post(urls.register, formData)
    };

    getAllUsers(page: number, offset: number, count: number): IRes<IPage<IUser>> {
        return axiosService.get(`${urls.register}?${urls.page}${page}${urls.offset}${offset}${urls.count}${count}`)
    };

    getPositions(): IRes<IPositionsResponse<IPositions>> {
        return axiosService.get(urls.positions)
    };

    getUserById(id: number): IRes<IUserSingleResponse<IUserSingle>> {
        return axiosService.get(`${urls.register}/${id}`)
    };
}


export const apiService = new ApiService()