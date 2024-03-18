import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {apiReducer} from "./slice";

const rootReducer = combineReducers({
    apiReducer,
});

const setupStore = () => configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export {setupStore};
