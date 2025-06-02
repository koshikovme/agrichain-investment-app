import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import {InvestmentRequestDto, InvestmentsDto, InvestmentState} from "./investmentTypes";
import {keycloak} from "../auth/keycloak";

const API_URL = process.env.REACT_APP_GATEWAY_INVESTMENTS_URL || 'http://localhost:8072/agrichain/investments';

const initialState: InvestmentState = {
    investments: [],
    paypalUrl: '',
    selectedInvestment: null,
    isLoading: false,
    error: null,
};

// ✅ /publish-investment-lot
export const publishInvestmentLot = createAsyncThunk(
    'investment/publishInvestmentLot',
    async (investmentData: InvestmentsDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/publish-investment-lot`,
                investmentData,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data as number; // investmentNumber
        } catch (error) {
            return rejectWithValue('Failed to publish investment lot');
        }
    }
);

// ✅ /fetch-investment
export const fetchInvestment = createAsyncThunk(
    'investment/fetchInvestment',
    async (investmentNumber: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/fetch-investment?investmentNumber=${investmentNumber}`);
            return response.data as InvestmentsDto;
        } catch (error) {
            return rejectWithValue('Failed to fetch investment');
        }
    }
);

// ✅ /fetch-investments
export const fetchInvestments = createAsyncThunk(
    'investment/fetchInvestments',
    async (accountNumber: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-investments?accountNumber=${accountNumber}`);
            return response.data as InvestmentsDto[];
        } catch (error) {
            return rejectWithValue('Failed to fetch investments');
        }
    }
);

// ✅ /fetch-all-investments
export const fetchAllInvestments = createAsyncThunk(
    'investment/fetchAllInvestments',
    async () => {
        const response = await axios.get(`${API_URL}/fetch-all-investments`);
        return response.data as InvestmentsDto[];
    }
);


// ✅ /invest
export const investInLot = createAsyncThunk(
    'investment/investInLot',
    async (investmentRequest: InvestmentRequestDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/invest`,
                investmentRequest,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data as string;
        } catch (error) {
            return rejectWithValue('Failed to invest');
        }
    }
);

// ✅ /update-investment
export const updateInvestment = createAsyncThunk(
    'investment/updateInvestment',
    async (investment: InvestmentsDto, { rejectWithValue }) => {
        try {
            await axios.post(`${API_URL}/api/update-investment`, investment);
            return investment;
        } catch (error) {
            return rejectWithValue('Failed to update investment');
        }
    }
);

// ✅ /delete-investment
export const deleteInvestment = createAsyncThunk(
    'investment/deleteInvestment',
    async (investmentNumber: number, { rejectWithValue }) => {
        try {
            await axios.get(`${API_URL}/api/delete-investment?investmentNumber=${investmentNumber}`);
            return investmentNumber;
        } catch (error) {
            return rejectWithValue('Failed to delete investment');
        }
    }
);

const investmentSlice = createSlice({
    name: 'investment',
    initialState,
    reducers: {
        resetInvestmentState: (state) => {
            state.investments = [];
            state.selectedInvestment = null;
            state.isLoading = false;
            state.error = null;
        },
        // Внутри createSlice reducers:
        setInvestments: (state, action) => {
            state.investments = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvestments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvestments.fulfilled, (state, action: PayloadAction<InvestmentsDto[]>) => {
                state.isLoading = false;
                state.investments = action.payload;
            })
            .addCase(fetchInvestments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(investInLot.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(investInLot.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.paypalUrl = action.payload;
            })
            .addCase(investInLot.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })



            .addCase(fetchAllInvestments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllInvestments.fulfilled, (state, action: PayloadAction<InvestmentsDto[]>) => {
                state.isLoading = false;
                state.investments = action.payload;
            })
            .addCase(fetchAllInvestments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchInvestment.fulfilled, (state, action: PayloadAction<InvestmentsDto>) => {
                state.selectedInvestment = action.payload;
            })

            .addCase(deleteInvestment.fulfilled, (state, action: PayloadAction<number>) => {
                state.investments = state.investments.filter(inv => inv.investmentNumber !== action.payload);
            });
    }
});

export const { resetInvestmentState, setInvestments } = investmentSlice.actions;
export default investmentSlice.reducer;
