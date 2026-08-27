import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPayments } from "../features/payment/paymentsSlice";
import { PaymentsDto } from "../features/payment/paymentTypes";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { appleFont, centeredPageTitleSx, pageContainerSx } from "../constants/ui";
import { useTranslation } from "react-i18next";

type PaymentCardProps = {
    payment: PaymentsDto;
};

const PaymentCard = ({ payment }: PaymentCardProps) => {
    const { t } = useTranslation();

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                boxShadow: 2,
                fontFamily: appleFont,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 5 },
            }}
        >
            <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    {t('transactions.cardTitle', { number: payment.paymentId })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('transactions.status')}: {payment.status}
                </Typography>
                <Typography variant="body1" fontWeight={500} mt={1}>
                    {t('transactions.amount')}: <strong>{payment.amount} USD</strong>
                </Typography>
                <Typography variant="body2" mt={1}>
                    {payment.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

const TransactionsPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.reducer.auth);
    const { payments } = useAppSelector((state) => state.reducer.payment);

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch, isAuthenticated]);

    return (
        <Box sx={pageContainerSx}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={centeredPageTitleSx}
            >
                {t('transactions.title')}
            </Typography>
            {payments.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    {t('transactions.noTransactions')}
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {payments.map((payment) => (
                        <Grid key={payment.paymentId}>
                            <PaymentCard payment={payment} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default TransactionsPage;
