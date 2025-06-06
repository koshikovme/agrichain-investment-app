import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {UserInfo, UsersDto, UserState} from './userTypes'
import axios from 'axios'
import {keycloak} from "../auth/keycloak";

const API_URL = process.env.REACT_APP_GATEWAY_USERS_URL || 'http://localhost:8072/agrichain/users';

const initialState: UserState = {
    userInfo: {
        image: '',
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        accountsDto: {
            accountNumber: 0,
            accountType: ''
        },
        investmentsLots: [],
        investmentsApplications: []
    },
    isLoading: false,
    error: null
}

export const checkUserExists = createAsyncThunk(
    'user/checkUserExists',
    async (mobileNumber: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-user-details`, {
                params: { mobileNumber },
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data as UserInfo;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null; // пользователь не найден
            }
            return rejectWithValue('Ошибка при проверке пользователя');
        }
    }
);


export const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async (mobileNumber: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-user-details`, {
                params: { mobileNumber },
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("Server response:", response.data); // Добавь это
            return response.data as UserInfo;

        } catch (error) {
            return rejectWithValue('Ошибка при получении подробной информации о пользователе')
        }
    }
)

export const createUser = createAsyncThunk(
    'user/createUser',
    async (token: typeof keycloak.token, { rejectWithValue }) => {
        try {
            // Ensure token is available and valid
            if (!keycloak.token) {
                return rejectWithValue('No Keycloak token available');
            }

            const response = await axios.post(
                `${API_URL}/create-user`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при создании пользователя');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (updatedUser: UsersDto, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/update-user`,
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data as boolean
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении данных пользователя')
        }
    }
)

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (mobileNumber: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/delete-user`, {
                params: { mobileNumber }
            })
            return response.data as boolean
        } catch (error) {
            return rejectWithValue('Ошибка при удалении пользователя')
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: (state) => {
            state.userInfo = initialState.userInfo
            state.error = null
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<UserInfo>) => {
                state.isLoading = false
                state.userInfo = action.payload
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

            .addCase(createUser.rejected, (state, action) => {
                state.error = action.payload as string
            })

            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload as string
            })

            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export const { resetUser, setUserInfo } = userSlice.actions
export default userSlice.reducer
