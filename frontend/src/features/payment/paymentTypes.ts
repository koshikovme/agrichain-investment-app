export interface PaymentState {
    payments: PaymentsDto[];
    selectedPayment: PaymentResponseDto | null;
    isLoading: boolean;
    error: string | null;
    paymentResponse: PaymentResponseDto | null;
}

export interface PaymentsDto {
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    description: string; // Adjust according to your enum
}

export interface PaymentResponseDto {
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    paypalUrl?: string;
    payerEmail?: string;
    payerId?: string;
    merchantId?: string;
    solanaSignature?: string;
    solanaAddress?: string;
    storedInSolana?: boolean;
    solanaTransactionUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
    metadata?: Record<string, string>;
    errorCode?: string;
    errorMessage?: string;
}
