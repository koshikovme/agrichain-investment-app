import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    CircularProgress,
    Button,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Chip,
    IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUserDetails } from "../../features/user/userSlice";
import { keycloak } from "../../features/auth/keycloak";
import UpdateProfileModal from "../UI/modal/UpdateProfileModal";
import { useUserWebSocket } from "../../features/user/useUsersWebSocket";
import { useTranslation } from "react-i18next";
import { InvestmentLotsDto } from "../../features/investment/investmentTypes";

// Admin interfaces
interface NotificationDto {
    id: string;
    message: string;
    type: string;
    createdAt: string;
    userId?: string;
    isRead: boolean;
}

interface EmailNotificationDto {
    userID: number;
    email: string;
    name: string;
    notificationType: string;
    metadata: { [key: string]: string };
    createdAt: string;
}

interface WebNotificationDto {
    userID: number;
    email: string;
    name: string;
    notificationType: string;
    metadata: { [key: string]: string };
    createdAt: string;
    isRead: boolean;
}

interface PaginatedEmailNotifications {
    notifications: EmailNotificationDto[];
    total: number;
}

interface PaginatedWebNotifications {
    notifications: WebNotificationDto[];
    total: number;
}

interface UserDto {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    createdAt: string;
    accountType?: string;
}

interface PaginatedUsers {
    users: UserDto[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
}

const PersonalInformationPanel: FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [adminTab, setAdminTab] = useState(0);
    const [emailNotifications, setEmailNotifications] = useState<PaginatedEmailNotifications | null>(null);
    const [webNotifications, setWebNotifications] = useState<PaginatedWebNotifications | null>(null);
    const [users, setUsers] = useState<PaginatedUsers | null>(null);
    const [emailNotificationPage, setEmailNotificationPage] = useState(1);
    const [webNotificationPage, setWebNotificationPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [loadingEmailNotifications, setLoadingEmailNotifications] = useState(false);
    const [loadingWebNotifications, setLoadingWebNotifications] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    
    const dispatch = useAppDispatch();
    const { userInfo, isLoading, error } = useAppSelector((state) => state.reducer.user);
    const { t } = useTranslation();

    useUserWebSocket(userInfo.mobileNumber);

    // Check if user is admin
    const isAdmin = keycloak.tokenParsed?.realm_access?.roles?.includes('admin') || 
                   userInfo.name?.toLowerCase() === 'admin';

    const fetchEmailNotifications = async (page: number = 1) => {
        setLoadingEmailNotifications(true);
        try {
            const response = await fetch(`/agrichain/notifications/email?page=${page}&per_page=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const result = await response.json();
                setEmailNotifications(result.data);
            }
        } catch (error) {
            console.error('Error fetching email notifications:', error);
            console.log(error);
        } finally {
            setLoadingEmailNotifications(false);
        }
    };

    const fetchWebNotifications = async (page: number = 1) => {
        setLoadingWebNotifications(true);
        try {
            const response = await fetch(`/agrichain/notifications/web?page=${page}&per_page=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const result = await response.json();
                setWebNotifications(result.data);
            }
        } catch (error) {
            console.error('Error fetching web notifications:', error);
        } finally {
            setLoadingWebNotifications(false);
        }
    };

    const fetchUsers = async (page: number = 1) => {
        setLoadingUsers(true);
        try {
            const response = await fetch(`/agrichain/users/fetch-all-user-details?page=${page}&size=10`, {
                headers: {
                    'Authorization': `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        const mobileNumber = keycloak.tokenParsed?.mobile_number;
        if (mobileNumber) dispatch(fetchUserDetails(mobileNumber));
        
        if (isAdmin) {
            fetchEmailNotifications();
            fetchWebNotifications();
            fetchUsers();
        }
    }, [dispatch, isAdmin]);

    const handleEmailNotificationPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setEmailNotificationPage(value);
        fetchEmailNotifications(value);
    };

    const handleWebNotificationPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setWebNotificationPage(value);
        fetchWebNotifications(value);
    };

    const handleUserPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setUserPage(value);
        fetchUsers(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getNotificationTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'registration': return 'success';
            case 'login': return 'info';
            case 'investment_success': return 'success';
            case 'invested_in_you': return 'warning';
            case 'other': return 'default';
            default: return 'info';
        }
    };

    const getMessageFromMetadata = (metadata: { [key: string]: string }) => {
        return metadata?.subject || metadata?.body || 'No message';
    };

    const calculateTotalPages = (total: number, perPage: number = 10) => {
        return Math.ceil(total / perPage);
    };

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
                {t('common.error')}: {error}
            </Box>
        );
    }

    if (!userInfo.name) {
        return <Typography textAlign="center" mt={4}>{t('personal.noUserData')}</Typography>;
    }

    // Admin Dashboard
    if (isAdmin) {
        return (
            <Box
                sx={{
                    px: 3,
                    py: 5,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    background: "linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%)",
                    minHeight: "100vh"
                }}
            >
                <Card
                    sx={{
                        maxWidth: 1200,
                        mx: "auto",
                        p: 4,
                        borderRadius: 4,
                        boxShadow: 4,
                        border: "2px solid #2196f3",
                        background: "linear-gradient(135deg, #e8eaf6 80%, #f3e5f5 100%)"
                    }}
                >
                    <Box display="flex" alignItems="center" gap={3} mb={3}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: "#e3f2fd",
                                border: "3px solid #2196f3"
                            }}
                        >
                            <AdminPanelSettingsIcon sx={{ fontSize: 60, color: "#2196f3" }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700} color="#1976d2">
                                🛡️ {t('admin.dashboard')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {t('admin.welcome')}, {userInfo.name}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                {userInfo.email} | 📱 {userInfo.mobileNumber}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: "#bbdefb" }} />

                    <Tabs
                        value={adminTab}
                        onChange={(e, newValue) => setAdminTab(newValue)}
                        sx={{ mb: 3 }}
                    >
                        <Tab 
                            icon={<NotificationsIcon />} 
                            label={t('admin.emailNotifications')} 
                            sx={{ fontWeight: 600 }}
                        />
                        <Tab 
                            icon={<NotificationsIcon />} 
                            label={t('admin.webNotifications')} 
                            sx={{ fontWeight: 600 }}
                        />
                        <Tab 
                            icon={<PeopleIcon />} 
                            label={t('admin.users')} 
                            sx={{ fontWeight: 600 }}
                        />
                    </Tabs>

                    {/* Email Notifications Tab */}
                    {adminTab === 0 && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="#1976d2">
                                    📧 {t('admin.emailNotificationsList')}
                                </Typography>
                                <IconButton onClick={() => fetchEmailNotifications(emailNotificationPage)} color="primary">
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                            
                            {loadingEmailNotifications ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.message')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.type')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.email')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.name')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.createdAt')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {emailNotifications?.notifications.map((notification, index) => (
                                                    <TableRow key={`email-${notification.userID}-${index}`}>
                                                        <TableCell>{getMessageFromMetadata(notification.metadata)}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={notification.notificationType} 
                                                                color={getNotificationTypeColor(notification.notificationType)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{notification.email}</TableCell>
                                                        <TableCell>{notification.name}</TableCell>
                                                        <TableCell>{formatDate(notification.createdAt)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    
                                    {emailNotifications && calculateTotalPages(emailNotifications.total) > 1 && (
                                        <Box display="flex" justifyContent="center">
                                            <Pagination
                                                count={calculateTotalPages(emailNotifications.total)}
                                                page={emailNotificationPage}
                                                onChange={handleEmailNotificationPageChange}
                                                color="primary"
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    )}

                    {/* Web Notifications Tab */}
                    {adminTab === 1 && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="#1976d2">
                                    🌐 {t('admin.webNotificationsList')}
                                </Typography>
                                <IconButton onClick={() => fetchWebNotifications(webNotificationPage)} color="primary">
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                            
                            {loadingWebNotifications ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.message')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.type')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.status')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.email')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.name')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.createdAt')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {webNotifications?.notifications.map((notification, index) => (
                                                    <TableRow key={`web-${notification.userID}-${index}`}>
                                                        <TableCell>{getMessageFromMetadata(notification.metadata)}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={notification.notificationType} 
                                                                color={getNotificationTypeColor(notification.notificationType)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={notification.isRead ? t('admin.read') : t('admin.unread')} 
                                                                color={notification.isRead ? 'default' : 'warning'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{notification.email}</TableCell>
                                                        <TableCell>{notification.name}</TableCell>
                                                        <TableCell>{formatDate(notification.createdAt)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    
                                    {webNotifications && calculateTotalPages(webNotifications.total) > 1 && (
                                        <Box display="flex" justifyContent="center">
                                            <Pagination
                                                count={calculateTotalPages(webNotifications.total)}
                                                page={webNotificationPage}
                                                onChange={handleWebNotificationPageChange}
                                                color="primary"
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    )}

                    {/* Users Tab */}
                    {adminTab === 2 && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="#1976d2">
                                    👥 {t('admin.usersList')}
                                </Typography>
                                <IconButton onClick={() => fetchUsers(userPage)} color="primary">
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                            
                            {loadingUsers ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.name')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.email')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.phone')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.accountType')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.createdAt')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {users?.users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                            <Box>
                                                                <Typography fontWeight={600}>
                                                                    {user.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {user.firstName} {user.lastName}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.mobileNumber}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={user.accountType || t('admin.standard')} 
                                                                color="info"
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    
                                    {users && users.totalPages > 1 && (
                                        <Box display="flex" justifyContent="center">
                                            <Pagination
                                                count={users.totalPages}
                                                page={userPage}
                                                onChange={handleUserPageChange}
                                                color="primary"
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    )}
                </Card>
            </Box>
        );
    }

    // Regular user profile
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
                            ✏️ {t('personal.editProfile')}
                        </Button>
                        <UpdateProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
                    </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: "#c8e6c9" }} />

                <Grid container spacing={2} mb={2}>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('personal.profileNumber')}
                        </Typography>
                        <Typography fontWeight={600} color="#2e7d32">
                            {userInfo.accountsDto?.accountNumber}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('personal.accountType')}
                        </Typography>
                        <Typography fontWeight={600} color="#2e7d32">
                            {userInfo.accountsDto?.accountType}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#c8e6c9" }} />

                <Typography variant="h6" mb={2} color="#388e3c">
                    🌱 {t('personal.myInvestments')}
                </Typography>
                {userInfo.investmentsLots && userInfo.investmentsLots.length > 0 ? (
                    userInfo.investmentsLots.map((investment: InvestmentLotsDto) => (
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
                                    💰 {investment.sum} USD
                                </Typography>
                                <Typography color="text.secondary">{investment.description}</Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography color="text.secondary">{t('personal.noInvestments')}</Typography>
                )}
            </Card>
        </Box>
    );
};

export default PersonalInformationPanel;