import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import { executePaymentForInvestment, fetchPaymentById, fetchPayments } from "../features/payment/paymentsSlice";
import { useTranslation } from "react-i18next";
import { fetchUserDetails } from "../features/user/userSlice";
import { keycloak } from "../features/auth/keycloak";
import { Box, Paper, Typography, Button, Stack, useMediaQuery } from "@mui/material";
import { GiFarmTractor } from "react-icons/gi";
import { useTheme } from "@mui/material/styles";
import {fetchInvestment, updateInvestmentLot} from "../features/investment/investmentsSlice";
import { InvestmentLotsDto, InvestmentType, InvestmentLotStatus, ConfirmationType } from '../features/investment/investmentTypes';

const PaymentSuccessPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { payments, selectedPayment } = useAppSelector((state) => state.reducer.payment);
    const {selectedInvestmentLot} = useAppSelector((state) => state.reducer.investment);
    const [executed, setExecuted] = useState(false);
    const { userInfo } = useAppSelector((state) => state.reducer.user);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [solanaVerified, setSolanaVerified] = useState(false);
    const [solanaLoading, setSolanaLoading] = useState(false);

    const getCookieValue = (name: string) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');
        const cookie = cookies.find(row => row.startsWith(name + '='));
        return cookie ? cookie.split('=')[1] : null;
    };

    useEffect(() => {
        const reference = searchParams.get("reference");
        console.log("Reference from URL:", reference);
        if (reference) {
            setSolanaVerified(true);
        }
    }, [searchParams]);

    useEffect(() => {
        const paymentId = searchParams.get("token");
        if (paymentId) {
            dispatch(fetchUserDetails(keycloak.tokenParsed?.mobileNumber));
            dispatch(fetchPayments());
        }
    }, [dispatch, searchParams]);

    useEffect(() => {
        const paymentId = searchParams.get("token");
        if (paymentId && payments.length > 0) {
            const existingPayment = payments.find(payment => payment.paymentId === paymentId);
            if (existingPayment) {
                dispatch(fetchPaymentById(existingPayment.id));
            }
        }
    }, [dispatch, payments, searchParams]);

    useEffect(() => {
        if (!selectedPayment || executed) return;
        const investmentNumber = getCookieValue('investmentNumber');
        const paymentRequest = {
            walletId: 123,
            investmentNumber: Number(investmentNumber),
            accountNumber: userInfo.accountsDto.accountNumber,
            currency: "USD",
            mobileNumber: keycloak.tokenParsed?.mobileNumber || "1234567890",
            paymentResponseDto: selectedPayment,
        };
        dispatch(executePaymentForInvestment(paymentRequest))
            .unwrap()
            .then(() => {
                setExecuted(true);
                console.log("IN WORK STATUS SET");
                // @ts-ignore
                dispatch(updateInvestmentLot({...selectedInvestmentLot, investmentStatus: "IN_WORK"}));
                document.cookie = 'investmentNumber=; path=/; max-age=0';
            })
            .catch(() => {
                setExecuted(true);
                document.cookie = 'investmentNumber=; path=/; max-age=0';

            });
    }, [dispatch, selectedPayment, executed, userInfo]);

    return (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center"
             sx={{ background: "linear-gradient(120deg, #e8f5e9 0%, #fffde7 100%)", p: isMobile ? 2 : 4 }}>
            <Paper elevation={6} sx={{ borderRadius: 4, p: isMobile ? 3 : 6, maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 8px 32px 0 rgba(34,139,34,0.15)" }}>
                <Stack spacing={3} alignItems="center">
                    <Box sx={{ background: "linear-gradient(135deg, #a5d6a7 60%, #fffde7 100%)", borderRadius: "50%", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                        <GiFarmTractor size={44} color="#388e3c" />
                    </Box>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} color="success.main" sx={{ fontFamily: "inherit" }}>
                        {solanaVerified
                            ? t("investments.paymentSuccessSolana") || "Платёж через Solana успешно подтверждён!"
                            : t("investments.paymentSuccess") || "Платёж успешно выполнен!"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                        {t("investments.paymentId") || "ID платежа"}: <b>{solanaVerified ? searchParams.get("reference") : searchParams.get("token")}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {t("investments.thankYou") || "Спасибо за ваш вклад в развитие агросектора Казахстана!"}
                    </Typography>
                    <Button variant="contained" color="success" href="/"
                            sx={{
                                mt: 2, borderRadius: 3, fontWeight: 600, fontSize: isMobile ? 16 : 18,
                                px: 4, py: 1.5, background: "linear-gradient(90deg, #81c784 0%, #fbc02d 100%)",
                                color: "#fff", boxShadow: "0 2px 8px 0 rgba(34,139,34,0.10)",
                                "&:hover": { background: "linear-gradient(90deg, #66bb6a 0%, #fbc02d 100%)" },
                            }}>
                        {t("investments.backToMain") || "На главную"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default PaymentSuccessPage;