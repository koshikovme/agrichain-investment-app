export interface PaymentState {
    payments: PaymentsDto[];
    selectedPayment: PaymentsDto | null;
    isLoading: boolean;
    error: string | null;
}

export interface PaymentsDto {
    id: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    description: string; // Adjust according to your enum
}