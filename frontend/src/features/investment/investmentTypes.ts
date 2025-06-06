import {PaymentResponseDto} from "../payment/paymentTypes";

export type InvestmentType = 'CATTLE' | 'LAND' | 'EQUIPMENT' | 'CASH'; // уточни по enum backend
export type ConfirmationType = 'PAYMENT' | 'CHECK' | 'ESCROW' | 'NFT';
export type InvestmentLotStatus = 'OPEN' | 'UNDER_REVIEW' | 'CLOSED' | 'REJECTED';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';

export interface InvestmentLotsDto {
    investmentNumber: number;
    investmentType: InvestmentType;
    accountNumber: number;
    sum: number;
    description: string;
    returnConditions: string;
    requirements: string;
    documentsUrl: string;
    deadline: string; // ISO string format for LocalDateTime
    confirmationType: ConfirmationType;
    investmentStatus: InvestmentLotStatus;
}

export interface InvestmentApplicationDto {
    lotId: number;
    farmerId: number;
    proposalText: string;
    documentsUrl: string;
    expectedProfit: string;
    applicationStatus: ApplicationStatus;
}

export interface InvestmentRequestDto {
    walletId: number;
    investmentNumber: number;
    accountNumber: number;
    currency: string;
    mobileNumber: string;
    paymentResponseDto: PaymentResponseDto | null;
}

export interface InvestmentState {
    investmentLots: InvestmentLotsDto[];
    investmentsApplications: InvestmentApplicationDto[];
    selectedInvestmentLot: InvestmentLotsDto | null;
    selectedInvestmentApplication: InvestmentApplicationDto | null;
    isLoading: boolean;
    error: string | null;
}