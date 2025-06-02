export interface InvestmentState {
    investments: InvestmentsDto[];
    paypalUrl: string | null;
    selectedInvestment: InvestmentsDto | null;
    isLoading: boolean;
    error: string | null;
}

export interface InvestmentsDto {
    investmentNumber: number;
    investmentType: 'CATTLE' | 'LAND' | 'EQUIPMENT'; // Adjust according to your enum
    accountNumber: number;
    sum: number;
    description: string;
    investmentStatus: 'WAITING_FOR_INVESTMENTS' | 'INVESTED' | 'FINISHED'; // Adjust according to your enum
}

export interface InvestmentRequestDto {
    walletId: number;
    investmentNumber: number;
    accountNumber: number;
    currency: string;
    mobileNumber: string;
}
