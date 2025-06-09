import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import {PaymentResponseDto, PaymentsDto, PaymentState} from "./paymentTypes";
import {keycloak} from "../auth/keycloak";
import {InvestmentRequestDto} from "../investment/investmentTypes";

const API_URL = process.env.REACT_APP_GATEWAY_INVESTMENTS_URL || 'http://localhost:8072/agrichain/investments';

const initialState: PaymentState = {
    payments: [],
    selectedPayment: null,
    isLoading: false,
    error: null,
    paymentResponse: null,
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
            return response.data as PaymentResponseDto[];
        } catch (error) {
            return rejectWithValue('Failed to fetch payments');
        }
    }
);

export const fetchPaymentById = createAsyncThunk(
    'investment/fetchPaymentById',
    async (paymentId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get-payment/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data as PaymentResponseDto;
        } catch (error) {
            return rejectWithValue('Failed to fetch payment by ID');
        }
    }
);


// Создать платёж
export const createPaymentForInvestment = createAsyncThunk(
    'investment/createPaymentForInvestment',
    async (investmentRequest: InvestmentRequestDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/create-payment`,
                investmentRequest,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data as PaymentResponseDto;
        } catch (error) {
            return rejectWithValue('Failed to create payment');
        }
    }
);

// Исполнить платёж
export const executePaymentForInvestment = createAsyncThunk(
    'investment/executePaymentForInvestment',
    async (investmentRequest: InvestmentRequestDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/execute-payment`,
                investmentRequest,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                        'agrichain-correlation-id': 'frontend',
                    },
                }
            );
            return response.data as PaymentResponseDto;
        } catch (error) {
            return rejectWithValue('Failed to execute payment');
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
            .addCase(fetchPaymentById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPaymentById.fulfilled, (state, action: PayloadAction<PaymentResponseDto>) => {
                state.isLoading = false;
                state.selectedPayment = action.payload;
            })
            .addCase(fetchPaymentById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
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
            .addCase(createPaymentForInvestment.fulfilled, (state, action: PayloadAction<PaymentResponseDto>) => {
                state.paymentResponse = action.payload;
            })
            .addCase(executePaymentForInvestment.fulfilled, (state, action: PayloadAction<PaymentResponseDto>) => {
                state.paymentResponse = action.payload;
            })
    }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
