import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    CircularProgress,
    Button
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserDetails } from "../../features/user/userSlice";
import { keycloak } from "../../features/auth/keycloak";
import UpdateProfileModal from "../UI/modal/UpdateProfileModal";
import {useUserWebSocket} from "../../features/user/useUsersWebSocket";

const PersonalInformationPanel: FC = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { userInfo, isLoading, error } = useAppSelector((state) => state.reducer.user);
    const { isAuthenticated } = useAppSelector((state) => state.reducer.auth);

    useUserWebSocket(userInfo.mobileNumber);

    useEffect(() => {
        console.log("AUTH STATUS:", isAuthenticated);
        const mobileNumber = keycloak.tokenParsed?.mobile_number;
        if (mobileNumber) dispatch(fetchUserDetails(mobileNumber));
    }, [dispatch, isAuthenticated]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="success" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box color="error.main" textAlign="center" mt={4}>
                Error: {error}
            </Box>
        );
    }

    if (!userInfo.name) {
        navigate("/");
        return null;
    }


    return (
        <Box
            sx={{
                px: 3,
                py: 5,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)",
                minHeight: "100vh"
            }}
        >
            <Card
                sx={{
                    maxWidth: 800,
                    mx: "auto",
                    p: 4,
                    borderRadius: 4,
                    boxShadow: 4,
                    border: "2px solid #4caf50",
                    background: "linear-gradient(135deg, #f1f8e9 80%, #fffde7 100%)"
                }}
            >
                <Box display="flex" alignItems="center" gap={3} mb={3}>
                    <Avatar
                        src={userInfo.image || '/images/profile2.png'}
                        alt={userInfo.name}
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: "#e8f5e9",
                            border: "3px solid #4caf50"
                        }}
                    >
                        <AgricultureIcon sx={{ fontSize: 60, color: "#4caf50" }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="#2e7d32">
                            {userInfo.name} - {userInfo.firstName} {userInfo.lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {userInfo.email}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            📱 {userInfo.mobileNumber}
                        </Typography>
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="outlined"
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                borderColor: "#4caf50",
                                color: "#388e3c",
                                fontWeight: 600,
                                "&:hover": { borderColor: "#388e3c", background: "#e8f5e9" }
                            }}
                        >
                            ✏️ Редактировать профиль
                        </Button>
                        <UpdateProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
                    </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: "#c8e6c9" }} />

                <Grid container spacing={2} mb={2}>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Номер профиля
                        </Typography>
                        <Typography fontWeight={600} color="#2e7d32">
                            {userInfo.accountsDto?.accountNumber}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            Тип счёта
                        </Typography>
                        <Typography fontWeight={600} color="#2e7d32">
                            {userInfo.accountsDto?.accountType}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#c8e6c9" }} />

                <Typography variant="h6" mb={2} color="#388e3c">
                    🌱 Мои инвестиции
                </Typography>
                {userInfo.investments.length > 0 ? (
                    userInfo.investments.map((investment) => (
                        <Card
                            key={investment.investmentNumber}
                            sx={{
                                mb: 2,
                                borderRadius: 3,
                                boxShadow: 2,
                                background: "linear-gradient(90deg, #f1f8e9 60%, #fffde7 100%)",
                                borderLeft: "5px solid #fbc02d"
                            }}
                        >
                            <CardContent>
                                <Typography fontWeight={700} color="#2e7d32">
                                    #{investment.investmentNumber} — {investment.investmentStatus}
                                </Typography>
                                <Typography color="#fbc02d" fontWeight={600}>
                                    💰 {investment.sum} KZT
                                </Typography>
                                <Typography color="text.secondary">{investment.description}</Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography color="text.secondary">Пока нет инвестиций.</Typography>
                )}
            </Card>
        </Box>
    );
};

export default PersonalInformationPanel;