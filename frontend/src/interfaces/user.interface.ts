export interface IUserCreate {
    userName: string;
    userEmail: string;
    userPhone: string;
    position_id: number;
    userPhoto: File[];
}

export interface IUser {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    position: string;
    position_id: string;
    registration_timestamp: number;
    userPhoto: string;
}

export interface IUserSingleResponse<T> {
    success: boolean;
    user: T;
}

export interface IUserSingle {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    position_id: number;
    photo: string;
}
