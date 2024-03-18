import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IError, IPositionsResponse, IToken, IUser, IUserSingle, IUserSingleResponse} from "../../interfaces";
import {apiService} from "../../services";
import Cookies from 'js-cookie';
import {IPage} from "../../interfaces/page.interface";
import {IPositions} from "../../interfaces";

interface IState {
    tokenStatus: boolean,
    page: number,
    offset: number,
    count: number,
    users: IUser[],
    total_pages: number;
    total_users: number;
    positions: IPositions[],
    user: IUserSingle | null,
    userId: number,
    error: IError | null;
}

const initialState: IState = {
    tokenStatus: false,
    page: 1,
    offset: 0,
    count: 5,
    users: [],
    total_pages: 0,
    total_users: 0,
    positions: [],
    user: null,
    userId: 1,
    error: null,
}


const register = createAsyncThunk<void, FormData, { rejectValue: IError }>(
    'apiSlice/register',
    async (formData: FormData, {rejectWithValue}) => {
        try {
            await apiService.register(formData);
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)



const getToken = createAsyncThunk<IToken, void, { rejectValue: IError }>(
    'apiSlice/getToken',
    async (_, {rejectWithValue}) => {
        try {
            const response = await apiService.getToken();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);



const getPositions = createAsyncThunk<IPositionsResponse<IPositions>, void, { rejectValue: IError }>(
    'apiSlice/getPositions',
    async (_, {rejectWithValue}) => {
        try {
            const response = await apiService.getPositions();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);


const getAllUsers = createAsyncThunk<IPage<IUser>, {
    page: number;
    offset: number;
    count: number
}, { rejectValue: IError }>(
    'apiSlice/getAllUsers',
    async ({page,offset, count}, {rejectWithValue}) => {
        try {
            const response = await apiService.getAllUsers(page, offset, count);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const getUserById = createAsyncThunk<IUserSingleResponse<IUserSingle>, number, { rejectValue: IError }>(
    'apiSlice/getUserById',
    async (userId, {rejectWithValue}) => {
        try {
            const response = await apiService.getUserById(userId);
            return response.data;
        } catch (error: any) {
            console.log(error.response.data)
            return rejectWithValue(error.response.data);
        }
    }
);


const slice = createSlice({
    name: 'apiSlice',
    initialState,
    reducers: {
        setTokenStatus(state, action) {
            state.tokenStatus = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setOffset: (state, action: PayloadAction<number>) => {
            state.offset = action.payload;
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
        setError: (state, action: PayloadAction<IError | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(register.fulfilled, (state, action) => {
                Cookies.set('token', '');
                state.tokenStatus = false;

            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload!;
                state.user = null;
            })
            .addCase(getToken.fulfilled, (state, action) => {
                const token = action.payload;
                Cookies.set('token', token.token);
                state.tokenStatus = true;
                state.error = null;
            })
            .addCase(getToken.rejected, (state, action) => {
                state.error = action.payload!;
                state.tokenStatus = false;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                const users = action.payload.users;
                state.users = users;
                state.total_pages = action.payload.total_pages;
                state.total_users = action.payload.total_users;
                state.error = null;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.error = action.payload!;
                state.users = [];
            })
            .addCase(getPositions.fulfilled, (state, action) => {
                const positions = action.payload.positions;
                state.positions = positions;
                state.error = null;
            })
            .addCase(getPositions.rejected, (state, action) => {
                state.error = action.payload!;
                state.positions = [];

            })
            .addCase(getUserById.fulfilled, (state, action) => {
                const user = action.payload.user;
                state.user = user;
                state.error = null;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.error = action.payload!;
                console.log(action.payload);
                state.user = null;
            })

});

const {actions, reducer: apiReducer} = slice;

const apiActions = {
    ...actions,
    register,
    getToken,
    getAllUsers,
    getPositions,
    getUserById,
}

export {
    apiActions,
    apiReducer
}