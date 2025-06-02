import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    TextField,
    Box,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateUser } from '../../../features/user/userSlice';
import { UsersDto } from '../../../features/user/userTypes';

interface UpdateProfileModalProps {
    open: boolean;
    onClose: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const { userInfo, isLoading } = useAppSelector((state) => state.reducer.user);

    const [formData, setFormData] = useState<UsersDto>({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        accountsDto: {
            accountNumber: 0,
            accountType: '',
        },
    });

    // Sync with userInfo when modal opens
    useEffect(() => {
        if (open && userInfo) {
            setFormData({
                name: userInfo.name || '',
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                email: userInfo.email || '',
                mobileNumber: userInfo.mobileNumber || '',
                accountsDto: {
                    accountNumber: userInfo.accountsDto?.accountNumber || 0,
                    accountType: userInfo.accountsDto?.accountType || '',
                },
            });
        }
    }, [open, userInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'accountNumber' || name === 'accountType') {
            setFormData((prev) => ({
                ...prev,
                accountsDto: {
                    accountNumber: name === 'accountNumber' ? Number(value) || 0 : prev.accountsDto?.accountNumber ?? 0,
                    accountType: name === 'accountType' ? value : prev.accountsDto?.accountType ?? '',
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleSubmit = () => {
        dispatch(updateUser(formData)).then(() => {
            onClose();
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                }}
            >
                Update Profile
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Username"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProfileModal;
