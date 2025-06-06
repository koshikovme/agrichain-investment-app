import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { publishInvestmentLot } from '../features/investment/investmentsSlice';
import {
    InvestmentLotsDto,
    InvestmentType,
    InvestmentLotStatus,
    ConfirmationType
} from '../features/investment/investmentTypes';
import {
    Box, Button, MenuItem, Select, TextField, Typography,
    InputLabel, FormControl, Paper, Alert, Snackbar
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNotificationWebSocket } from "../features/notification/useNotificationWebSocket";
import FileUpload from './upload/FileUpload'; // ваш компонент загрузки
import { uploadFile, resetUploadState } from '../features/upload/uploadSlice';

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

const investmentTypes: InvestmentType[] = ['CATTLE', 'LAND', 'EQUIPMENT', 'CASH'];
const confirmationTypes: ConfirmationType[] = ['PAYMENT', 'CHECK', 'ESCROW', 'NFT'];
const investmentStatuses: InvestmentLotStatus[] = ['OPEN', 'CLOSED'];

const CreateInvestmentForm = () => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.reducer.user);
    const upload = useAppSelector((state) => state.reducer.upload);
    const { open, notification, handleClose } = useNotificationWebSocket(userInfo.accountsDto.accountNumber);

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

    // Обработка выбора файла
    const handleFileUpload = async (file: File) => {
        await dispatch(uploadFile(file));
    };

    // После успешной загрузки файла сохраняем ссылку
    React.useEffect(() => {
        if (upload.success && upload.fileUrl) {
            setForm((prev) => ({
                ...prev,
                documentsUrl: upload.fileUrl ?? undefined, // не null!
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
        } else {
            alert('Не удалось создать инвестицию');
        }
    };

    return (
        <>
            <Paper elevation={4} sx={{ p: 4, mb: 3, borderRadius: 4, maxWidth: 500, mx: 'auto', fontFamily: appleFont, background: 'rgba(255,255,255,0.95)' }}>
                <Typography variant="h5" fontWeight={700} mb={2} sx={{ fontFamily: appleFont, letterSpacing: 0.5 }}>
                    Создать инвестиционный лот
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: appleFont }}>
                    {/* ...другие поля... */}
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
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Загрузка файла подтверждения */}
                    <FileUpload onFileSelect={handleFileUpload} />
                    {upload.isLoading && <Typography>Загрузка файла...</Typography>}
                    {upload.error && <Alert severity="error">{upload.error}</Alert>}
                    {form.documentsUrl && (
                        <Alert severity="success">Файл загружен: <a href={form.documentsUrl} target="_blank" rel="noopener noreferrer">Скачать</a></Alert>
                    )}
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, borderRadius: 3, fontWeight: 600, fontFamily: appleFont, fontSize: 16, textTransform: 'none', boxShadow: 2 }}>
                        Создать
                    </Button>
                </Box>
            </Paper>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    <div dangerouslySetInnerHTML={{ __html: notification || '' }} />
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateInvestmentForm;