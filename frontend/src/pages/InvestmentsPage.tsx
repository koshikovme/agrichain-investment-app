import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUserDetails } from "../features/user/userSlice";
import { fetchInvestments, fetchAllInvestments } from "../features/investment/investmentsSlice";
import { keycloak } from "../features/auth/keycloak";
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, Card, CardContent } from "@mui/material";
import CreateInvestmentForm from "../components/CreateInvestmentForm";
import { InvestmentLotsDto } from "../features/investment/investmentTypes";
import { useTranslation } from "react-i18next";

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

const InvestmentCard = ({
    inv,
    onBid,
    onDividends,
    isFarmer,
    isOwner
}: {
    inv: InvestmentLotsDto;
    onBid?: (id: number) => void;
    onDividends?: (id: number) => void;
    isFarmer: boolean;
    isOwner: boolean;
}) => {
    const { t } = useTranslation();
    
    return (
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
                    {t('investments.cardTitle', { number: inv.investmentNumber })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('investments.status')}: {inv.investmentStatus}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('investments.type')}: {inv.investmentType}
                </Typography>
                <Typography variant="body1" fontWeight={500} mt={1}>
                    {t('investments.amount')}: <strong>{inv.sum} USD</strong>
                </Typography>
                <Typography variant="body2" mt={1}>
                    {t('investments.description')}: {inv.description}
                </Typography>
                <Typography variant="body2" mt={1}>
                    {t('investments.returnConditions')}: {inv.returnConditions}
                </Typography>
                <Typography variant="body2" mt={1}>
                    {t('investments.requirements')}: {inv.requirements}
                </Typography>
                {/* Фермер может подать заявку на открытый чужой лот */}
                {isFarmer && !isOwner && inv.investmentStatus === "OPEN" && (
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, borderRadius: 2, fontFamily: appleFont }}
                        onClick={() => onBid && onBid(inv.investmentNumber)}
                    >
                        {t('investments.submitApplication')}
                    </Button>
                )}
                {/* Фермер может выплатить дивиденды по своему лоту */}
                {isFarmer && isOwner && (
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2, borderRadius: 2, fontFamily: appleFont }}
                        onClick={() => onDividends && onDividends(inv.investmentNumber)}
                    >
                        {t('investments.payDividends')}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

const InvestmentsPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { userInfo, isLoading, error } = useAppSelector((state) => state.reducer.user);
    const { investmentLots,
        investmentsApplications,
        selectedInvestmentApplication,
        selectedInvestmentLot
    } = useAppSelector((state) => state.reducer.investment);

    const [openForm, setOpenForm] = useState(false);

    const isInvestor = userInfo.accountsDto?.accountType === "INVESTORS";
    const isFarmer = userInfo.accountsDto?.accountType === "FARMERS";
    const myAccount = userInfo.accountsDto?.accountNumber;

    useEffect(() => {
        const mobileNumber = keycloak.tokenParsed?.mobile_number;
        if (mobileNumber) dispatch(fetchUserDetails(mobileNumber));
    }, [dispatch]);

    useEffect(() => {
        if (isInvestor && myAccount) {
            dispatch(fetchAllInvestments());
        } else if (isFarmer) {
            dispatch(fetchAllInvestments());
        }
    }, [dispatch, isInvestor, isFarmer, myAccount, keycloak]);

    // Для фермера показываем только открытые и не свои лоты для подачи заявки
    let visibleInvestments = investmentLots;
    if (isFarmer && myAccount) {
        visibleInvestments = investmentLots.filter(
            (inv) => inv.investmentStatus === "OPEN" && inv.accountNumber !== myAccount
        );
    }

    const handleBid = (investmentNumber: number) => {
        alert(t('investments.applicationSent', { number: investmentNumber }));
    };

    const handleDividends = (investmentNumber: number) => {
        alert(t('investments.dividendsInitiated', { number: investmentNumber }));
    };

    if (isLoading) return <Typography>{t('common.loading')}</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ p: 3, fontFamily: appleFont }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontFamily: appleFont, fontWeight: 700, mb: 4 }}
            >
                {isInvestor ? t('investments.myInvestmentLots') : t('investments.availableLotsForApplication')}
            </Typography>
            {isInvestor && (
                <>
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{
                                borderRadius: 3,
                                fontWeight: 600,
                                fontFamily: appleFont,
                                fontSize: 16,
                                textTransform: "none",
                                boxShadow: 2,
                            }}
                            onClick={() => setOpenForm(true)}
                        >
                            {t('investments.createLot')}
                        </Button>
                    </Box>
                    <Dialog sx={{ fontFamily: appleFont, fontWeight: 700, borderRadius: 30}} open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                        <DialogContent>
                            <CreateInvestmentForm />
                        </DialogContent>
                    </Dialog>
                </>
            )}
            {visibleInvestments.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    {t('investments.noLots')}
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {visibleInvestments.map((inv: InvestmentLotsDto) => (
                        <Grid key={inv.investmentNumber}>
                            <InvestmentCard
                                inv={inv}
                                onBid={handleBid}
                                onDividends={handleDividends}
                                isFarmer={isFarmer}
                                isOwner={inv.accountNumber === myAccount}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default InvestmentsPage;