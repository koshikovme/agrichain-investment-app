import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {keycloak} from "../auth/keycloak";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8072/agrichain/investments';

interface UploadState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    fileUrl: string | null; // добавлено поле
}

const initialState: UploadState = {
    isLoading: false,
    error: null,
    success: false,
    fileUrl: null,
};

export const uploadFile = createAsyncThunk(
    'file/uploadFile',
    async (file: File, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Сервер возвращает строку с url
            return response.data as string;
        } catch (error) {
            return rejectWithValue('Failed to upload file');
        }
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetUploadState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
            state.fileUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
                state.fileUrl = null;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.fileUrl = action.payload;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.fileUrl = null;
            });
    },
});

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;