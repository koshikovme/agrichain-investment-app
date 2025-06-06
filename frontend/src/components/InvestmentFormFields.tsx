import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { InvestmentType, ConfirmationType, InvestmentLotStatus } from '../features/investment/investmentTypes';

interface Props {
    form: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (e: any) => void;
}

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

// Массивы значений для селектов
const investmentTypes: InvestmentType[] = ['CATTLE', 'LAND', 'EQUIPMENT', 'CASH'];
const confirmationTypes: ConfirmationType[] = ['PAYMENT', 'CHECK', 'ESCROW', 'NFT'];
const investmentStatuses: InvestmentLotStatus[] = ['OPEN', 'UNDER_REVIEW', 'CLOSED', 'REJECTED'];

const InvestmentFormFields: React.FC<Props> = ({ form, onInputChange, onSelectChange }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: appleFont }}>
        <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: appleFont }}>Тип</InputLabel>
            <Select
                name="investmentType"
                value={form.investmentType}
                label="Тип"
                onChange={onSelectChange}
                sx={{ fontFamily: appleFont }}
            >
                {investmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type === 'CATTLE' ? 'Скот' :
                         type === 'LAND' ? 'Земля' :
                         type === 'EQUIPMENT' ? 'Оборудование' :
                         type === 'CASH' ? 'Денежные средства' : type}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <TextField
            label="Сумма (USD)"
            name="sum"
            type="number"
            value={form.sum}
            onChange={onInputChange}
            fullWidth
            inputProps={{ min: 0 }}
            sx={{ fontFamily: appleFont }}
        />
        <TextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={onInputChange}
            fullWidth
            sx={{ fontFamily: appleFont }}
        />
        <TextField
            label="Условия возврата"
            name="returnConditions"
            value={form.returnConditions}
            onChange={onInputChange}
            fullWidth
            sx={{ fontFamily: appleFont }}
        />
        <TextField
            label="Требования"
            name="requirements"
            value={form.requirements}
            onChange={onInputChange}
            fullWidth
            sx={{ fontFamily: appleFont }}
        />
        <TextField
            label="Дедлайн (ISO)"
            name="deadline"
            value={form.deadline}
            onChange={onInputChange}
            fullWidth
            sx={{ fontFamily: appleFont }}
        />
        <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: appleFont }}>Тип подтверждения</InputLabel>
            <Select
                name="confirmationType"
                value={form.confirmationType}
                label="Тип подтверждения"
                onChange={onSelectChange}
                sx={{ fontFamily: appleFont }}
            >
                {confirmationTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl fullWidth>
            <InputLabel sx={{ fontFamily: appleFont }}>Статус</InputLabel>
            <Select
                name="investmentStatus"
                value={form.investmentStatus}
                label="Статус"
                onChange={onSelectChange}
                sx={{ fontFamily: appleFont }}
            >
                {investmentStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>
);

export default InvestmentFormFields;