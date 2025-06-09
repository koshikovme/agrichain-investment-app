import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { publishInvestmentLot } from '../../features/investment/investmentsSlice';
import { InvestmentLotsDto, InvestmentType, InvestmentLotStatus, ConfirmationType } from '../../features/investment/investmentTypes';
import { Box, Button, MenuItem, Select, Typography, InputLabel, FormControl, Paper, Alert, Snackbar, IconButton, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { useNotificationWebSocket } from "../../features/notification/useNotificationWebSocket";
import FileUpload from '../upload/FileUpload';
import { uploadFile, resetUploadState } from '../../features/upload/uploadSlice';
import InvestmentFormFields from './InvestmentFormFields';

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;
const confirmationTypes: ConfirmationType[] = ['PAYMENT', 'CHECK', 'ESCROW', 'NFT'];
const confirmationLabels: Record<ConfirmationType, string> = {
    PAYMENT: 'Платёж',
    CHECK: 'Чек',
    ESCROW: 'Эскроу',
    NFT: 'NFT',
};

interface Props {
    onClose: () => void;
}

const CreateInvestmentForm: React.FC<Props> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.reducer.user);
    const upload = useAppSelector((state) => state.reducer.upload);
    const { open, setOpen, notifications } = useNotificationWebSocket(userInfo.accountsDto.accountNumber);

    const [form, setForm] = useState<Partial<InvestmentLotsDto>>({
        investmentType: 'CATTLE',
        sum: 0,
        description: '',
        returnConditions: '',
        requirements: '',
        documentsUrl: '',
        deadline: '',
        confirmationType: 'PAYMENT',
        investmentStatus: 'OPEN',
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Обработка выбора файла
    const handleFileUpload = async (file: File) => {
        await dispatch(uploadFile(file));
    };

    React.useEffect(() => {
        if (upload.success && upload.fileUrl) {
            setForm((prev) => ({
                ...prev,
                documentsUrl: upload.fileUrl ?? undefined,
            }));
        }
    }, [upload.success, upload.fileUrl]);

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'sum' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo.accountsDto?.accountNumber) {
            alert('Не найден номер счёта пользователя');
            return;
        }

        const investmentPayload: InvestmentLotsDto = {
            investmentNumber: 0,
            investmentType: form.investmentType as InvestmentType,
            sum: Number(form.sum) || 0,
            description: form.description || '',
            returnConditions: form.returnConditions || '',
            requirements: form.requirements || '',
            documentsUrl: form.documentsUrl || '',
            deadline: form.deadline || '',
            confirmationType: form.confirmationType as ConfirmationType,
            investmentStatus: form.investmentStatus as InvestmentLotStatus,
            accountNumber: userInfo.accountsDto.accountNumber,
        };

        const resultAction = await dispatch(publishInvestmentLot(investmentPayload));

        if (publishInvestmentLot.fulfilled.match(resultAction)) {
            alert(`Инвестиция создана, номер: ${resultAction.payload}`);
            dispatch(resetUploadState());
            onClose();
        } else {
            alert('Не удалось создать инвестицию');
        }
    };

    const lastNotification = notifications.length > 0 ? notifications[0] : null;

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <Paper
            elevation={6}
            sx={{
                p: isMobile ? 2 : 4,
                borderRadius: 5,
                maxWidth: 540,
                mx: 'auto',
                fontFamily: appleFont,
                background: 'linear-gradient(135deg, #f1f8e9 80%, #fffde7 100%)',
                position: 'relative',
                boxShadow: 8,
            }}
        >
            <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight={700}
                mb={2}
                sx={{
                    fontFamily: appleFont,
                    letterSpacing: 0.5,
                    color: "#388e3c",
                    textAlign: "center",
                }}
            >
                🌱 Создать инвестиционный лот
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobile ? 1.5 : 2.5,
                    fontFamily: appleFont,
                }}
            >
                <InvestmentFormFields
                    form={form}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                />
                <FormControl fullWidth>
                    <InputLabel sx={{ fontFamily: appleFont }}>Тип подтверждения</InputLabel>
                    <Select
                        name="confirmationType"
                        value={form.confirmationType}
                        label="Тип подтверждения"
                        onChange={handleSelectChange}
                        sx={{ fontFamily: appleFont }}
                    >
                        {confirmationTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {confirmationLabels[type]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FileUpload onFileSelect={handleFileUpload} />
                {upload.isLoading && <Typography color="text.secondary">Загрузка файла...</Typography>}
                {upload.error && <Alert severity="error">{upload.error}</Alert>}
                {form.documentsUrl && (
                    <Alert severity="success" sx={{ fontSize: 14 }}>
                        Файл загружен: <a href={form.documentsUrl} target="_blank" rel="noopener noreferrer">Скачать</a>
                    </Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{
                        mt: 2,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontFamily: appleFont,
                        fontSize: isMobile ? 15 : 17,
                        textTransform: 'none',
                        boxShadow: 3,
                        background: "linear-gradient(90deg, #388e3c 60%, #bfa046 100%)",
                        '&:hover': { background: "linear-gradient(90deg, #2e7d32 60%, #bfa046 100%)" }
                    }}
                >
                    Создать лот
                </Button>
            </Box>
            <Snackbar
                open={open && !!lastNotification}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    <div>
                        {lastNotification ? (
                            <>
                                <strong>{lastNotification.subject}</strong>
                                <div>{lastNotification.body}</div>
                            </>
                        ) : null}
                    </div>
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default CreateInvestmentForm;