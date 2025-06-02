import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import {PaymentsDto, PaymentState} from "./paymentTypes";
import {keycloak} from "../auth/keycloak";

const API_URL = process.env.REACT_APP_GATEWAY_INVESTMENTS_URL || 'http://localhost:8072/agrichain/investments';

const initialState: PaymentState = {
    payments: [],
    selectedPayment: null,
    isLoading: false,
    error: null,
};


// ✅ /fetch-all-payments
export const fetchPayments = createAsyncThunk(
    'investment/fetchPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get-payments`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data as PaymentsDto[];
        } catch (error) {
            return rejectWithValue('Failed to fetch payments');
        }
    }
);



const paymentSlice = createSlice({
    name: 'investment',
    initialState,
    reducers: {
        resetPaymentState: (state) => {
            state.payments = [];
            state.selectedPayment = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<PaymentsDto[]>) => {
                state.isLoading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
