import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPayments } from "../features/payment/paymentsSlice";
import { Box, Typography, Card, CardContent, Grid, Chip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GiFarmTractor, GiWheat, GiMoneyStack } from "react-icons/gi";
import { PaymentResponseDto } from "../features/payment/paymentTypes";
import { useTranslation } from "react-i18next";

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

const statusColor = (status: string) => {
    switch (status) {
        case "SUCCESS": return "success";
        case "PENDING": return "warning";
        case "FAILED": return "error";
        default: return "default";
    }
};

const getPaymentIcon = (type?: string) => {
    if (type === "LAND") return <GiWheat size={32} color="#bfa046" />;
    if (type === "CATTLE") return <GiFarmTractor size={32} color="#388e3c" />;
    return <GiMoneyStack size={32} color="#fbc02d" />;
};

const PaymentCard = ({ payment }: { payment: PaymentResponseDto }) => {
    const { t } = useTranslation();
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 4,
                boxShadow: 3,
                fontFamily: appleFont,
                background: "linear-gradient(90deg, #f9fbe7 0%, #fffde7 100%)",
                border: "1.5px solid #c8e6c9",
                minWidth: 260,
                maxWidth: 350,
                mx: "auto",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                    {getPaymentIcon("CATTLE")}
                    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: appleFont }}>
                        {t('transactions.cardTitle', { number: payment.paymentId })}
                    </Typography>
                </Box>
                <Chip
                    label={t('transactions.status') + ": " + payment.status}
                    color={statusColor(payment.status)}
                    size="small"
                    sx={{ mb: 1, fontWeight: 500, fontFamily: appleFont }}
                />
                <Typography variant="body1" fontWeight={600} color="#388e3c" mb={1}>
                    {t('transactions.amount')}: <span style={{ color: "#bfa046" }}>{payment.amount} USD</span>
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    {payment.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {payment.createdAt && new Date(payment.createdAt).toLocaleString()}
                </Typography>
            </CardContent>
        </Card>
    );
};

const TransactionsPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { payments } = useAppSelector((state) => state.reducer.payment);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    return (
        <Box
            sx={{
                p: { xs: 1, sm: 3 },
                fontFamily: appleFont,
                minHeight: "100vh",
                bgcolor: "background.default",
                background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)"
            }}
        >
            <Typography
                variant={isMobile ? "h5" : "h4"}
                align="center"
                gutterBottom
                sx={{
                    fontFamily: appleFont,
                    fontWeight: 700,
                    mb: { xs: 2, sm: 4 },
                    color: "#388e3c"
                }}
            >
                {t('transactions.title')}
            </Typography>
            {payments.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    {t('transactions.noTransactions')}
                </Typography>
            ) : (
                <Grid
                    container
                    spacing={isMobile ? 2 : 3}
                    justifyContent="center"
                    alignItems="stretch"
                >
                    {payments.map((payment) => (
                        <Grid
                            key={payment.paymentId}
                            display="flex"
                            justifyContent="center"
                        >
                            <PaymentCard payment={payment} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default TransactionsPage;