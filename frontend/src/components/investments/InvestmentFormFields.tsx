import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, useMediaQuery } from '@mui/material';
import { InvestmentType, InvestmentLotStatus } from '../../features/investment/investmentTypes';
import { useTheme } from '@mui/material/styles';

interface Props {
    form: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (e: any) => void;
}

const investmentTypes: InvestmentType[] = ['CATTLE', 'LAND', 'EQUIPMENT', 'CASH'];
const investmentTypeLabels: Record<InvestmentType, string> = {
    CATTLE: 'Скот',
    LAND: 'Земля',
    EQUIPMENT: 'Оборудование',
    CASH: 'Денежные средства',
};
const investmentStatuses: InvestmentLotStatus[] = ['OPEN', 'UNDER_REVIEW', 'CLOSED', 'REJECTED'];
const statusLabels: Record<InvestmentLotStatus, string> = {
    OPEN: 'Открыт',
    UNDER_REVIEW: 'На рассмотрении',
    CLOSED: 'Закрыт',
    REJECTED: 'Отклонён',
};

const appleFont = `"SF Pro Display","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif`;

const InvestmentFormFields: React.FC<Props> = ({ form, onInputChange, onSelectChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 1.5 : 2,
            fontFamily: appleFont,
        }}>
            <FormControl fullWidth>
                <InputLabel sx={{ fontFamily: appleFont }}>Тип актива</InputLabel>
                <Select
                    name="investmentType"
                    value={form.investmentType}
                    label="Тип актива"
                    onChange={onSelectChange}
                    sx={{ fontFamily: appleFont }}
                >
                    {investmentTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {investmentTypeLabels[type]}
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
                label="Описание проекта"
                name="description"
                value={form.description}
                onChange={onInputChange}
                fullWidth
                multiline
                minRows={2}
                sx={{ fontFamily: appleFont }}
            />
            <TextField
                label="Условия возврата"
                name="returnConditions"
                value={form.returnConditions}
                onChange={onInputChange}
                fullWidth
                multiline
                minRows={2}
                sx={{ fontFamily: appleFont }}
            />
            <TextField
                label="Требования к инвестору"
                name="requirements"
                value={form.requirements}
                onChange={onInputChange}
                fullWidth
                multiline
                minRows={2}
                sx={{ fontFamily: appleFont }}
            />
            <TextField
                label="Дедлайн"
                name="deadline"
                value={form.deadline}
                type="date"
                onChange={onInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ fontFamily: appleFont }}
            />
        </Box>
    );
};

export default InvestmentFormFields;