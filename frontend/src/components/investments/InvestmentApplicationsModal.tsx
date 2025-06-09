// frontend/src/components/investments/InvestmentApplicationsModal.tsx
import React, {useState} from "react";
import { Modal, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useTranslation } from "react-i18next";
import { InvestmentApplicationDto } from "../../features/investment/investmentTypes";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {updateInvestmentApplication} from "../../features/investment/investmentsSlice";
import {createPaymentForInvestment, executePaymentForInvestment} from "../../features/payment/paymentsSlice";

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
    const {paymentResponse} = useAppSelector((state) => state.reducer.payment);

    const handleAcceptApplication = async (application: InvestmentApplicationDto) => {
        try {
            // Обновляем статус заявки на ACCEPTED
            await dispatch(
                updateInvestmentApplication({
                    ...application,
                    applicationStatus: "ACCEPTED",
                })
            ).unwrap();

            alert(t("investments.applicationAccepted"));
        } catch (error) {
            console.error(t("investments.errorUpdatingApplication"), error);
        }
    };

    const handlePayInvestmentCreation = async (application: InvestmentApplicationDto) => {
        try {
            // Создаем запрос на создание платежа
            const paymentRequest = {
                walletId: application.farmerId,
                investmentNumber: application.lotId,
                accountNumber: application.farmerId,
                currency: "USD",
                mobileNumber: "1234567890", // Замените на реальный номер
                paymentResponseDto: null,
            };

            const paymentResponse = await dispatch(createPaymentForInvestment(paymentRequest)).unwrap();

            if (paymentResponse.paypalUrl) {
                // Перенаправляем пользователя на PayPal URL
                window.location.href = paymentResponse.paypalUrl;
            } else {
                alert(t("investments.errorCreatingPayment"));
            }
        } catch (error) {
            console.error(t("investments.errorCreatingPayment"), error);
        }
    };

    const handlePayInvestmentExecution = async (application: InvestmentApplicationDto) => {
        try {
            // Создаем платеж для фермера
            const paymentRequest = {
                walletId: application.farmerId,
                investmentNumber: application.lotId,
                accountNumber: application.farmerId,
                currency: "USD",
                mobileNumber: "1234567890", // Замените на реальный номер
                paymentResponseDto: paymentResponse,
            };

            const response = await dispatch(
                executePaymentForInvestment(paymentRequest)
            ).unwrap();

            alert(
                t("investments.paymentInitiated", {
                    url: response.paypalUrl || "N/A",
                })
            );
        } catch (error) {
            console.error(t("investments.errorCreatingPayment"), error);
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
                                        <button
                                            onClick={() => handleAcceptApplication(application)}
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            {t("investments.accept")}
                                        </button>
                                    )}
                                    {application.applicationStatus === "ACCEPTED" && (
                                        <button
                                            onClick={() => handlePayInvestmentCreation(application)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            {t("investments.pay")}
                                        </button>
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