import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    InvestmentLotsDto,
    InvestmentApplicationDto,
    InvestmentState,
} from './investmentTypes';
import { keycloak } from '../auth/keycloak';

const API_URL = process.env.REACT_APP_GATEWAY_INVESTMENTS_URL || 'http://localhost:8072/agrichain/investments';

const initialState: InvestmentState = {
    investmentLots: [],
    investmentsApplications: [],
    selectedInvestmentLot: null,
    selectedInvestmentApplication: null,
    isLoading: false,
    error: null,
};

// Публикация лота
export const publishInvestmentLot = createAsyncThunk(
    'investment/publishInvestmentLot',
    async (investmentData: InvestmentLotsDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/publish-investment-lot`,
                investmentData,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                        'agrichain-correlation-id': 'frontend',
                    },
                }
            );
            return response.data as number; // investmentNumber
        } catch (error) {
            return rejectWithValue('Failed to publish investment lot');
        }
    }
);

export const createInvestmentApplication = createAsyncThunk(
    'investment/createInvestmentApplication',
    async (application: InvestmentApplicationDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/apply-investment`, application, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to create investment application');
        }
    }
);

// Получить один лот
export const fetchInvestment = createAsyncThunk(
    'investment/fetchInvestment',
    async (investmentNumber: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-investment`, {
                params: { investmentNumber },
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data as InvestmentLotsDto;
        } catch (error) {
            return rejectWithValue('Failed to fetch investment');
        }
    }
);

// Получить лоты по аккаунту
export const fetchInvestments = createAsyncThunk(
    'investment/fetchInvestments',
    async (accountNumber: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-investments`, {
                params: { accountNumber },
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data as InvestmentLotsDto[];
        } catch (error) {
            return rejectWithValue('Failed to fetch investments');
        }
    }
);

// Получить все лоты
export const fetchAllInvestments = createAsyncThunk(
    'investment/fetchAllInvestments',
    async () => {
        const response = await axios.get(
            `${API_URL}/fetch-all-investments`,
            {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data as InvestmentLotsDto[];
    }
);

// Получить одну заявку на лот
export const fetchInvestmentApplication = createAsyncThunk(
    'investment/fetchInvestmentApplication',
    async ({ investmentNumber, accountNumber }: { investmentNumber: number; accountNumber: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-investments-application`, {
                params: { investmentNumber, accountNumber },
                headers: { 'agrichain-correlation-id': 'frontend' },
            });
            return response.data as InvestmentApplicationDto;
        } catch (error) {
            return rejectWithValue('Failed to fetch investment application');
        }
    }
);

// Получить все заявки на лот
export const fetchInvestmentLotApplications = createAsyncThunk(
    'investment/fetchInvestmentLotApplications',
    async (investmentNumber: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-investment-lot-applications`, {
                params: { investmentNumber },
                headers: { 'agrichain-correlation-id': 'frontend' },
            });
            return response.data as InvestmentApplicationDto[];
        } catch (error) {
            return rejectWithValue('Failed to fetch investment lot applications');
        }
    }
);

// Получить все заявки пользователя
export const fetchAllInvestmentApplications = createAsyncThunk(
    'investment/fetchAllInvestmentApplications',
    async (accountNumber: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetch-all-investment-applications`, {
                params: { accountNumber },
                headers: { 'agrichain-correlation-id': 'frontend' },
            });
            return response.data as InvestmentApplicationDto[];
        } catch (error) {
            return rejectWithValue('Failed to fetch all investment applications');
        }
    }
);

export const updateInvestmentApplication = createAsyncThunk(
    'investment/updateInvestmentApplication',
    async (application: InvestmentApplicationDto, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/update-investment-application`,
                application,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data as InvestmentApplicationDto;
        } catch (error) {
            return rejectWithValue('Failed to update investment application');
        }
    }
);

export const deleteInvestmentApplication = createAsyncThunk(
    'investment/deleteInvestmentApplication',
    async (applicationId: number, { rejectWithValue }) => {
        try {
            await axios.get(`${API_URL}/delete-investment-application`, {
                params: { applicationId },
                headers: { 'agrichain-correlation-id': 'frontend' },
            });
            return applicationId;
        } catch (error) {
            return rejectWithValue('Failed to delete investment application');
        }
    }
);

// Обновить лот
export const updateInvestmentLot = createAsyncThunk(
    'investment/updateInvestmentLot',
    async (investment: InvestmentLotsDto, { rejectWithValue }) => {
        try {
            await axios.post(
                `${API_URL}/update-investment-lot`,
                investment,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return investment;
        } catch (error) {
            return rejectWithValue('Failed to update investment');
        }
    }
);

// Удалить лот
export const deleteInvestment = createAsyncThunk(
    'investment/deleteInvestment',
    async (investmentNumber: number, { rejectWithValue }) => {
        try {
            await axios.get(`${API_URL}/delete-investment`, {
                params: { investmentNumber },
            });
            return investmentNumber;
        } catch (error) {
            return rejectWithValue('Failed to delete investment');
        }
    }
);

// Получить контактную информацию
export const fetchContactInfo = createAsyncThunk(
    'investment/fetchContactInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/contact-info`);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch contact info');
        }
    }
);

const investmentSlice = createSlice({
    name: 'investment',
    initialState,
    reducers: {
        resetInvestmentState: (state) => {
            state.investmentLots = [];
            state.investmentsApplications = [];
            state.selectedInvestmentLot = null;
            state.selectedInvestmentApplication = null;
            state.isLoading = false;
            state.error = null;
        },
        setInvestmentLots: (state, action: PayloadAction<InvestmentLotsDto[]>) => {
            state.investmentLots = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvestments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvestments.fulfilled, (state, action: PayloadAction<InvestmentLotsDto[]>) => {
                state.isLoading = false;
                state.investmentLots = action.payload;
            })
            .addCase(fetchInvestments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAllInvestments.fulfilled, (state, action: PayloadAction<InvestmentLotsDto[]>) => {
                state.investmentLots = action.payload;
            })
            .addCase(fetchInvestment.fulfilled, (state, action: PayloadAction<InvestmentLotsDto>) => {
                state.selectedInvestmentLot = action.payload;
            })
            .addCase(fetchInvestmentLotApplications.fulfilled, (state, action: PayloadAction<InvestmentApplicationDto[]>) => {
                state.investmentsApplications = action.payload;
            })
            .addCase(fetchAllInvestmentApplications.fulfilled, (state, action: PayloadAction<InvestmentApplicationDto[]>) => {
                state.investmentsApplications = action.payload;
            })
            .addCase(fetchInvestmentApplication.fulfilled, (state, action: PayloadAction<InvestmentApplicationDto>) => {
                state.selectedInvestmentApplication = action.payload;
            })
            .addCase(createInvestmentApplication.fulfilled, (state, action: PayloadAction<InvestmentApplicationDto>) => {
                state.investmentsApplications.push(action.payload);
            })
            .addCase(updateInvestmentLot.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateInvestmentLot.fulfilled, (state, action: PayloadAction<InvestmentLotsDto>) => {
                state.isLoading = false;
                const index = state.investmentLots.findIndex(inv => inv.investmentNumber === action.payload.investmentNumber);
                if (index !== -1) {
                    state.investmentLots[index] = action.payload;
                }
            })
            // .addCase(updateInvestmentApplication.fulfilled, (state, action: PayloadAction<InvestmentApplicationDto>) => {
            //     const index = state.investmentsApplications.findIndex(app => app. === action.payload.applicationId);
            //     if (index !== -1) {
            //         state.investmentsApplications[index] = action.payload;
            //     }
            // })
            .addCase(deleteInvestment.fulfilled, (state, action: PayloadAction<number>) => {
                state.investmentLots = state.investmentLots.filter(inv => inv.investmentNumber !== action.payload);
            });
    },
});

export const { resetInvestmentState, setInvestmentLots } = investmentSlice.actions;
export default investmentSlice.reducer;