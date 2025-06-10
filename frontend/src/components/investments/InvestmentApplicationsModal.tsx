import React, { useState } from "react";
import { Modal, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { InvestmentApplicationDto } from "../../features/investment/investmentTypes";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    fetchAllInvestments, fetchInvestment,
    updateInvestmentApplication, updateInvestmentLot
} from "../../features/investment/investmentsSlice";
import { createPaymentForInvestment } from "../../features/payment/paymentsSlice";
import QR from "../../features/solana/QR"; // Импортируйте ваш компонент QR

interface InvestmentApplicationsModalProps {
    open: boolean;
    onClose: () => void;
    applications: InvestmentApplicationDto[];
    selectedLotId: number | null;
}

const InvestmentApplicationsModal: React.FC<InvestmentApplicationsModalProps> = ({
    open,
    onClose,
    applications,
    selectedLotId,
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"paypal" | "solana">("paypal");
    const [showQR, setShowQR] = useState(false);
    const [currentApplication, setCurrentApplication] = useState<InvestmentApplicationDto | null>(null);

    const [paymentStarted, setPaymentStarted] = useState(false);

    const {selectedInvestmentLot} = useAppSelector((state) => state.reducer.investment);

    const handleAcceptApplication = async (application: InvestmentApplicationDto) => {
        await dispatch(updateInvestmentApplication({
            ...application,
            applicationStatus: "ACCEPTED"
        })).unwrap();
        await dispatch(fetchAllInvestments());
        onClose();
    };

    const handlePay = async (application: InvestmentApplicationDto) => {
        setCurrentApplication(application);
        if (selectedPaymentMethod === "paypal") {
            try {
                const paymentRequest = {
                    walletId: application.farmerId,
                    investmentNumber: application.lotId,
                    accountNumber: application.farmerId,
                    currency: "USD",
                    mobileNumber: "1234567890",
                    paymentResponseDto: null,
                };
                const paymentResponse = await dispatch(createPaymentForInvestment(paymentRequest)).unwrap();
                if (paymentResponse.paypalUrl) {
                    dispatch(fetchInvestment(application.lotId));
                    // @ts-ignore
                    dispatch(updateInvestmentLot({...selectedInvestmentLot, investmentStatus: "IN_WORK"}));
                    window.location.href = paymentResponse.paypalUrl;
                } else {
                    alert(t("investments.errorCreatingPayment"));
                }
            } catch (error) {
                alert(t("investments.errorCreatingPayment"));
            }
        } else if (selectedPaymentMethod === "solana") {
            setShowQR(true);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2, maxWidth: 600, mx: "auto" }}>
                <Typography variant="h6" mb={2}>
                    {t("investments.applicationsForLot", { number: selectedLotId })}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("admin.farmerId")}</TableCell>
                            <TableCell>{t("admin.proposalText")}</TableCell>
                            <TableCell>{t("investments.status")}</TableCell>
                            <TableCell>{t("investments.actions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((application: InvestmentApplicationDto) => (
                            <TableRow key={application.farmerId}>
                                <TableCell>{application.farmerId}</TableCell>
                                <TableCell>{application.proposalText}</TableCell>
                                <TableCell>{application.applicationStatus}</TableCell>
                                <TableCell>
                                    {application.applicationStatus === "PENDING" && (
                                        <Box>
                                            {!paymentStarted && (
                                                <RadioGroup
                                                    row
                                                    value={selectedPaymentMethod}
                                                    onChange={e => setSelectedPaymentMethod(e.target.value as "paypal" | "solana")}
                                                >
                                                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                                                    <FormControlLabel value="solana" control={<Radio />} label="Solana" />
                                                </RadioGroup>
                                            )}
                                            <Button
                                                onClick={() => handlePay(application)}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ mt: 1 }}
                                                disabled={paymentStarted}
                                            >
                                                {t("investments.pay")}
                                            </Button>
                                            {showQR && selectedPaymentMethod === "solana" && currentApplication?.farmerId === application.farmerId && (
                                                <Box mt={2}>
                                                    <QR width={140} height={140} />
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Modal>
    );
};

export default InvestmentApplicationsModal;