import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from "axios";

const API_URL = 'http://localhost:8072/agrichain/users'


interface User {
    username: string;
    email?: string;
    mobileNumber?: string;
    accountNumber?: number;
    // можешь добавить другие поля, которые тебе нужны
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

export interface NotifyAfterLoginArgs {
    accountNumber: number;
    username: string;
}

// ✅ /notify-after-login
export const notifyAfterLogin = createAsyncThunk(
    'auth/notifyAfterLogin',
    async ({ accountNumber, username }: NotifyAfterLoginArgs, { rejectWithValue }) => {
        try {
            await axios.get(`${API_URL}/notify-after-login?accountNumber=${accountNumber}&username=${username}`);
        } catch (error) {
            return rejectWithValue('Failed to fetch investments');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
        registration: (state) => {
            state.isAuthenticated = true;
            state.user = null;
        }
    },
});

export const { login, logout, registration } = authSlice.actions;
export default authSlice.reducer;
