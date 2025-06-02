import React, {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { keycloak } from "../features/auth/keycloak";
import { fetchUserDetails } from "../features/user/userSlice";
import { fetchAllInvestments, fetchInvestments, investInLot } from "../features/investment/investmentsSlice";
import CreateInvestmentForm from "../components/CreateInvestmentForm";
import SolanaPayLinkGenerator from "../features/solana/SolanaPayLinkGenerator";
import {useInvestmentsWebSocket} from "../features/investment/useInvestmentsWebSocket";

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

const InvestmentCard = ({ inv, onInvest }: { inv: any; onInvest?: (id: number) => void }) => (
    <Card
        variant="outlined"
        sx={{
            borderRadius: 3,
            boxShadow: 3,
            transition: "transform 0.2s",
            fontFamily: appleFont,
            "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
        }}
    >
        <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Инвестиция №{inv.investmentNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Статус: {inv.investmentStatus}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Тип: {inv.investmentType}
            </Typography>
            <Typography variant="body1" fontWeight={500} mt={1}>
                Сумма: <strong>{inv.sum} USD</strong>
            </Typography>
            <Typography variant="body2" mt={1}>
                {inv.description}
            </Typography>
            {onInvest && inv.investmentStatus === "WAITING_FOR_INVESTMENTS" ? (
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, borderRadius: 2, fontFamily: appleFont }}
                    onClick={() => onInvest(inv.investmentNumber)}
                >
                    Инвестировать
                </Button>
            ) : !onInvest && inv.investmentStatus === "WAITING_FOR_INVESTMENTS" ? null : (
                <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, fontWeight: "bold", color: "gray", fontFamily: appleFont }}
                >
                    Продано
                </Typography>
            )}
        </CardContent>
    </Card>
);

const InvestmentsPage = () => {
    const dispatch = useAppDispatch();
    useInvestmentsWebSocket(); // Подключаем WebSocket для обновления инвестиций
    const { userInfo, isLoading, error } = useAppSelector((state) => state.reducer.user);
    const { isAuthenticated } = useAppSelector((state) => state.reducer.auth);
    const { investments, paypalUrl } = useAppSelector((state) => state.reducer.investment);

    const [open, setOpen] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null);
    const [showSolana, setShowSolana] = useState(false);

    useEffect(() => {
        const mobileNumber = keycloak.tokenParsed?.mobile_number;
        if (mobileNumber) dispatch(fetchUserDetails(mobileNumber));
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (userInfo.accountsDto?.accountType === "INVESTORS") {
            // dispatch(fetchAllInvestments());
        } else if (userInfo.accountsDto?.accountType === "FARMERS" && userInfo.accountsDto?.accountNumber) {
            dispatch(fetchInvestments(userInfo.accountsDto.accountNumber));
        }
    }, [dispatch, userInfo.accountsDto?.accountNumber, userInfo.accountsDto?.accountType]);

    useEffect(() => {
        if (paypalUrl) window.location.href = paypalUrl;
    }, [paypalUrl]);

    const handleInvestClick = (investmentNumber: number) => {
        setSelectedInvestment(investmentNumber);
        setOpen(true);
        setShowSolana(false);
    };

    const handlePayPal = async () => {
        if (!userInfo.accountsDto?.accountNumber || selectedInvestment == null) return;
        await dispatch(
            investInLot({
                walletId: 123,
                investmentNumber: selectedInvestment,
                currency: "USD",
                accountNumber: userInfo.accountsDto.accountNumber,
                mobileNumber: userInfo.mobileNumber,
            })
        );
        setOpen(false);
    };

    if (isLoading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    if (userInfo.accountsDto?.accountType === "INVESTORS") {
        return (
            <Box sx={{ p: 3, fontFamily: appleFont }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ fontFamily: appleFont, fontWeight: 700, mb: 4 }}
                >
                    Доступные инвестиционные лоты
                </Typography>
                {investments.length === 0 ? (
                    <Typography color="text.secondary" align="center">
                        Нет доступных лотов
                    </Typography>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {investments.map((inv) => (
                            <Grid key={inv.investmentNumber}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        transition: "transform 0.2s",
                                        fontFamily: appleFont,
                                        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Инвестиция №{inv.investmentNumber}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Статус: {inv.investmentStatus}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Тип: {inv.investmentType}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500} mt={1}>
                                            Сумма: <strong>{inv.sum} USD</strong>
                                        </Typography>
                                        <Typography variant="body2" mt={1}>
                                            {inv.description}
                                        </Typography>
                                        {inv.investmentStatus === "WAITING_FOR_INVESTMENTS" && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 2, borderRadius: 2, fontFamily: appleFont }}
                                                onClick={() => handleInvestClick(inv.investmentNumber)}
                                            >
                                                Инвестировать
                                            </Button>
                                        )}
                                        {inv.investmentStatus !== "WAITING_FOR_INVESTMENTS" && (
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ mt: 2, fontWeight: "bold", color: "gray", fontFamily: appleFont }}
                                            >
                                                Продано
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Модальное окно выбора способа оплаты */}
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Выберите способ оплаты</DialogTitle>
                    <DialogContent>
                        {!showSolana ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePayPal}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    PayPal
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() => setShowSolana(true)}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    Solana Pay
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <SolanaPayLinkGenerator />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Закрыть</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    if (userInfo.accountsDto?.accountType === "FARMERS") {
        return (
            <Box sx={{ p: 3, fontFamily: appleFont }}>
                <CreateInvestmentForm />
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ fontFamily: appleFont, fontWeight: 700, mb: 4, mt: 2 }}
                >
                    Ваши инвестиционные лоты
                </Typography>
                {userInfo.investments?.length === 0 ? (
                    <Typography color="text.secondary" align="center">
                        У вас нет размещённых лотов
                    </Typography>
                ) : (
                    <Grid container spacing={3} justifyContent={"center"}>
                        {userInfo.investments.map((inv) => (
                            <Grid
                                sx={{ fontFamily: appleFont, fontWeight: 400, justifyContent: "center" }}
                                key={inv.investmentNumber}
                            >
                                <InvestmentCard inv={inv} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        );
    }

    return <Typography>Тип аккаунта не определён.</Typography>;
};

export default InvestmentsPage;