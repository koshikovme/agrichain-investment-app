import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { publishInvestmentLot } from '../features/investment/investmentsSlice';
import { InvestmentsDto } from '../features/investment/investmentTypes';
import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography,
    InputLabel,
    FormControl,
    Paper, Alert, Snackbar
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {useNotificationWebSocket} from "../features/notification/useNotificationWebSocket";

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

const CreateInvestmentForm = () => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.reducer.user);
    const { open, notification, handleClose } = useNotificationWebSocket(userInfo.accountsDto.accountNumber);


    const [form, setForm] = useState<Partial<InvestmentsDto>>({
        investmentType: 'CATTLE',
        sum: 0,
        description: '',
        investmentStatus: 'WAITING_FOR_INVESTMENTS',
    });

    // Для Select
    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Для TextField
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'sum' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo.accountsDto?.accountNumber) {
            alert('No account number found');
            return;
        }

        const investmentPayload: InvestmentsDto = {
            investmentNumber: 0,
            investmentType: form.investmentType as any,
            sum: form.sum || 0,
            description: form.description || '',
            investmentStatus: form.investmentStatus as any,
            accountNumber: userInfo.accountsDto.accountNumber,
        };

        const resultAction = await dispatch(publishInvestmentLot(investmentPayload));

        if (publishInvestmentLot.fulfilled.match(resultAction)) {
            alert(`Инвестиция создана, номер: ${resultAction.payload}`);
        } else {
            alert('Не удалось создать инвестицию');
        }
    };

    return (
      <>
        <Paper
            elevation={4}
            sx={{
                p: 4,
                mb: 3,
                borderRadius: 4,
                maxWidth: 500,
                mx: 'auto',
                fontFamily: appleFont,
                background: 'rgba(255,255,255,0.95)',
            }}
        >
            <Typography
                variant="h5"
                fontWeight={700}
                mb={2}
                sx={{ fontFamily: appleFont, letterSpacing: 0.5 }}
            >
                Создать инвестиционный лот
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    fontFamily: appleFont,
                }}
            >
                <FormControl fullWidth>
                    <InputLabel sx={{ fontFamily: appleFont }}>Тип</InputLabel>
                    <Select
                        name="investmentType"
                        value={form.investmentType}
                        label="Тип"
                        onChange={handleSelectChange}
                        sx={{ fontFamily: appleFont }}
                    >
                        <MenuItem value="CATTLE">Скот</MenuItem>
                        <MenuItem value="LAND">Земля</MenuItem>
                        <MenuItem value="EQUIPMENT">Оборудование</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Сумма (USD)"
                    name="sum"
                    type="number"
                    value={form.sum}
                    onChange={handleInputChange}
                    fullWidth
                    inputProps={{ min: 0 }}
                    sx={{ fontFamily: appleFont }}
                />
                <TextField
                    label="Описание"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ fontFamily: appleFont }}
                />
                <FormControl fullWidth>
                    <InputLabel sx={{ fontFamily: appleFont }}>Статус</InputLabel>
                    <Select
                        name="investmentStatus"
                        value={form.investmentStatus}
                        label="Статус"
                        onChange={handleSelectChange}
                        sx={{ fontFamily: appleFont }}
                    >
                        <MenuItem value="WAITING_FOR_INVESTMENTS">Ожидает инвестиций</MenuItem>
                        <MenuItem value="INVESTED">Инвестировано</MenuItem>
                        <MenuItem value="FINISHED">Завершено</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        mt: 2,
                        borderRadius: 3,
                        fontWeight: 600,
                        fontFamily: appleFont,
                        fontSize: 16,
                        textTransform: 'none',
                        boxShadow: 2,
                    }}
                >
                    Создать
                </Button>
            </Box>
        </Paper>
          <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
              <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                  <div dangerouslySetInnerHTML={{ __html: notification || '' }} />
              </Alert>
          </Snackbar>
      </>
    );
};

export default CreateInvestmentForm;