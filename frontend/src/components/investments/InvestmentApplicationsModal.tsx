// frontend/src/components/investments/InvestmentApplicationsModal.tsx
import React from "react";
import { Modal, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useTranslation } from "react-i18next";
import { InvestmentApplicationDto } from "../../features/investment/investmentTypes";

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
    selectedLotId
}) => {
    const { t } = useTranslation();

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, background: "#fff", borderRadius: 2, maxWidth: 600, mx: "auto", mt: 10 }}>
                <Typography variant="h6" mb={2}>
                    {t('admin.applicationsForLot', { number: selectedLotId })}
                </Typography>
                {applications.length === 0 ? (
                    <Typography>{t('admin.noApplications')}</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('admin.farmerId')}</TableCell>
                                <TableCell>{t('admin.proposalText')}</TableCell>
                                <TableCell>{t('admin.status')}</TableCell>
                                {/* Добавьте другие поля по необходимости */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applications.map(app => (
                                <TableRow key={app.farmerId}>
                                    <TableCell>{app.farmerId}</TableCell>
                                    <TableCell>{app.proposalText}</TableCell>
                                    <TableCell>{app.applicationStatus}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Modal>
    );
};

export default InvestmentApplicationsModal;