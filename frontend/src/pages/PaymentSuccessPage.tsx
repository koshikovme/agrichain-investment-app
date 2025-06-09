import React, { useEffect } from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import {executePaymentForInvestment, fetchPaymentById} from "../features/payment/paymentsSlice";
import { useTranslation } from "react-i18next";

const PaymentSuccessPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const {paymentResponse} = useAppSelector((state) => state.reducer.payment);

    useEffect(() => {
        const paymentId = searchParams.get("paymentId");
        const investmentNumber = searchParams.get("investmentNumber");

        if (paymentId != null) {
            dispatch(fetchPaymentById(paymentId))
        }

        if (paymentId && investmentNumber) {
            const paymentRequest = {
                walletId: 123, // Замените на реальный walletId, если требуется
                investmentNumber: Number(investmentNumber),
                accountNumber: 123, // Замените на реальный accountNumber, если требуется
                currency: "USD",
                mobileNumber: "1234567890", // Замените на реальный номер
                paymentResponseDto: paymentResponse,
            };

            dispatch(executePaymentForInvestment(paymentRequest))
                .unwrap()
                .then(() => {
                    alert(t("investments.paymentExecuted"));
                })
                .catch((error) => {
                    console.error(t("investments.errorExecutingPayment"), error);
                });
        }
    }, [dispatch, searchParams, t]);

    return (
        <div className="text-center mt-10">
            <h1 className="text-2xl font-bold text-green-700">{t("investments.paymentSuccess")}</h1>
            <p className="text-gray-600">{t("investments.paymentId")}: {searchParams.get("paymentId")}</p>
        </div>
    );
};

export default PaymentSuccessPage;