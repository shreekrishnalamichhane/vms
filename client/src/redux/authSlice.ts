import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type User = {
    id: number,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
}
export interface AuthContext {
    user: User | null,
    isAuth: boolean,
    accessToken: string | null,
    refreshToken: string | null
}
const initialState: AuthContext = {
    user: null,
    isAuth: false,
    accessToken: null,
    refreshToken: null
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuth = true;
        },
        resetUser(state) {
            state.user = null;
            state.isAuth = false;
            state.accessToken = null;
            state.refreshToken = null;
        },
        setToken(state, action: PayloadAction<{ accessToken: string, refreshToken: string }>) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        }
    }
})

export default authSlice.reducer
export const { setUser, resetUser, setToken } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
