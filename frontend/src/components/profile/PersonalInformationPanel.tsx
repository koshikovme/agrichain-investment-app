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
import {fetchAllUsers, fetchUserDetails} from "../../features/user/userSlice";
import { keycloak } from "../../features/auth/keycloak";
import UpdateProfileModal from "../UI/modal/UpdateProfileModal";
import { useUserWebSocket } from "../../features/user/useUsersWebSocket";
import { useTranslation } from "react-i18next";
import {InvestmentApplicationDto, InvestmentLotsDto } from "../../features/investment/investmentTypes";
import {useInvestmentsWebSocket} from "../../features/investment/useInvestmentsWebSocket";
import {fetchInvestmentLotApplications, updateInvestmentLot} from "../../features/investment/investmentsSlice";
import InvestmentApplicationsModal from "../investments/InvestmentApplicationsModal";
// Admin interfaces
interface NotificationDto {
    id: string;
    message: string;
    type: string;
    createdAt: string;
    userId?: string;
    isRead: boolean;
}

interface Metadata {
    body?: string;
    subject?: string;
}

interface EmailNotificationDto {
    UserID: number;
    Email: string;
    Name: string;
    NotificationType: string;
    Metadata: Metadata;
    CreatedAt: string;
}

interface WebNotificationDto {
    UserID: number;
    Email: string;
    Name: string;
    NotificationType: string;
    Metadata: Metadata;
    CreatedAt: string;
    IsRead: boolean;
}

interface PaginatedEmailNotifications {
    data: {
        notifications: EmailNotificationDto[];
    }
    total: number;
}

interface PaginatedWebNotifications {
    data: {
        notifications: WebNotificationDto[];
    }
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
    const [confirmedLotId, setConfirmedLotId] = useState<number | null>(null);
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
    const { userInfo, isLoading, error, usersList } = useAppSelector((state) => state.reducer.user);
    const { investmentLots } = useAppSelector((state) => state.reducer.investment);
    const { t } = useTranslation();

    const [openApplicationsModal, setOpenApplicationsModal] = useState(false);
    const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
    const [applications, setApplications] = useState<InvestmentApplicationDto[]>([]);

    useUserWebSocket();
    useInvestmentsWebSocket();

    // Check if user is admin
    const isAdmin = keycloak.tokenParsed?.realm_access?.roles?.includes('admin') || 
                   userInfo.name?.toLowerCase() === 'admin';


    const handleConfirmLot = async (lot: InvestmentLotsDto) => {
        try {
            await dispatch(updateInvestmentLot({ ...lot, investmentStatus: "OPEN" })).unwrap();
            setConfirmedLotId(lot.investmentNumber);
        } catch (e) {
            // обработка ошибки
        }
    };

    const handleOpenApplications = async (lotId: number) => {
        setSelectedLotId(lotId);
        setOpenApplicationsModal(true);
        const result = await dispatch(fetchInvestmentLotApplications(lotId)).unwrap();
        setApplications(result);
    };

    const fetchEmailNotifications = async (page: number = 1) => {
        setLoadingEmailNotifications(true);
        try {
            const response = await fetch(`http://localhost:8081/notifications/email?page=${page}&per_page=10`, {
                method: 'GET'
            });
            if (response.ok) {
                const result = await response.json();
                console.log("RAW RESPONSE: ", result);
                if (result?.data?.Notifications) {
                    setEmailNotifications({
                        data: {
                            notifications: result.data.Notifications
                        },
                        total: result.data.Total || 0
                    });

                    console.log("emailNotifications: ", emailNotifications)
                } else {
                    console.error('Invalid email notifications response format:', result);
                }
            } else {
                console.error('Failed to fetch email notifications:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching email notifications:', error);
        } finally {
            setLoadingEmailNotifications(false);
        }
    };

    const fetchWebNotifications = async (page: number = 1) => {
        setLoadingWebNotifications(true);
        try {
            const response = await fetch(`http://localhost:8081/notifications/web?page=${page}&per_page=10`, {
                method: 'GET'
            });
            if (response.ok) {
                const result = await response.json();
                console.log("RAW RESPONSE: ", result);
                if (result?.data?.Notifications) {
                    setWebNotifications({
                        data: {
                            notifications: result.data.Notifications
                        },
                        total: result.data.Total || 0
                    });
                } else {
                    console.error('Invalid web notifications response format:', result);
                }
            } else {
                console.error('Failed to fetch web notifications:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching web notifications:', error);
        } finally {
            setLoadingWebNotifications(false);
        }
    };

    useEffect(() => {
        const mobileNumber = keycloak.tokenParsed?.mobile_number;
        if (mobileNumber) dispatch(fetchUserDetails(mobileNumber));
        
        if (isAdmin) {
            fetchEmailNotifications();
            fetchWebNotifications();
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
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getNotificationTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'registration': return 'success';
            case 'login': return 'info';
            case 'investment_success': return 'success';
            case 'invested_in_you': return 'warning';
            case 'other': return 'default';
            default: return 'info';
        }
    };

    const getMessageFromMetadata = (metadata: Metadata) => {
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
                    px: 4,
                    py: 5,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fff8e1 100%)",
                    minHeight: "100vh",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: "radial-gradient(circle at 25% 25%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)",
                        pointerEvents: "none"
                    }
                }}
            >
                <Card
                    sx={{
                        maxWidth: 1200,
                        mx: "auto",
                        my: 2,
                        p: 5,
                        borderRadius: 6,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)",
                        border: "1px solid rgba(33, 150, 243, 0.2)",
                        background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                        backdropFilter: "blur(10px)",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <Box display="flex" alignItems="center" gap={3} mb={3}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: "linear-gradient(135deg, #e3f2fd, #f3e5f5)",
                                border: "4px solid",
                                borderImage: "linear-gradient(45deg, #2196f3, #9c27b0) 1",
                                boxShadow: "0 8px 24px rgba(33, 150, 243, 0.3)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            <AdminPanelSettingsIcon sx={{ fontSize: 70, color: "#2196f3" }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h3" fontWeight={800} 
                                sx={{
                                    background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 1
                                }}
                            >
                                🛡️ {t('admin.dashboard')}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                {t('admin.welcome')}, {userInfo.name}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {userInfo.email} | 📱 {userInfo.mobileNumber}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4, borderColor: "rgba(33, 150, 243, 0.2)", borderWidth: "2px" }} />

                    <Tabs
                        value={adminTab}
                        onChange={(e, newValue) => setAdminTab(newValue)}
                        sx={{ 
                            mb: 4,
                            "& .MuiTab-root": {
                                fontWeight: 600,
                                fontSize: "1rem",
                                textTransform: "none",
                                borderRadius: "12px 12px 0 0",
                                mx: 0.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(33, 150, 243, 0.08)",
                                    transform: "translateY(-2px)"
                                }
                            },
                            "& .MuiTabs-indicator": {
                                height: 4,
                                borderRadius: "4px 4px 0 0",
                                background: "linear-gradient(90deg, #2196f3, #9c27b0)"
                            }
                        }}
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
                        <Tab
                            icon={<AgricultureIcon />}
                            label={t('admin.investmentLots')}
                            sx={{ fontWeight: 600 }}
                        />
                    </Tabs>

                    {/* Email Notifications Tab */}
                    {adminTab === 0 && (
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h5" fontWeight={700}
                                    sx={{
                                        background: "linear-gradient(45deg, #1976d2, #2196f3)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    📧 {t('admin.emailNotificationsList')}
                                </Typography>
                                <IconButton 
                                    onClick={() => fetchEmailNotifications(emailNotificationPage)} 
                                    sx={{
                                        bgcolor: "rgba(33, 150, 243, 0.1)",
                                        "&:hover": { bgcolor: "rgba(33, 150, 243, 0.2)", transform: "rotate(180deg)" },
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            </Box>
                            
                            {loadingEmailNotifications ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ 
                                        mb: 3, 
                                        borderRadius: 4,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                        overflow: "hidden"
                                    }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ 
                                                    background: "linear-gradient(135deg, #e3f2fd, #f3e5f5)",
                                                    "& th": { 
                                                        fontWeight: 700, 
                                                        fontSize: "1rem",
                                                        color: "#1976d2",
                                                        borderBottom: "2px solid rgba(33, 150, 243, 0.2)"
                                                    }
                                                }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.message')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.type')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.email')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.name')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.createdAt')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {emailNotifications?.data.notifications?.length != null && emailNotifications?.data.notifications?.length > 0 ? (
                                                    emailNotifications?.data.notifications?.map((notification, index) => (
                                                        <TableRow key={`email-${notification.UserID}-${index}`}
                                                            sx={{
                                                                "&:hover": { 
                                                                    backgroundColor: "rgba(33, 150, 243, 0.04)",
                                                                    transform: "scale(1.01)"
                                                                },
                                                                transition: "all 0.2s ease",
                                                                "&:nth-of-type(even)": {
                                                                    backgroundColor: "rgba(0,0,0,0.02)"
                                                                }
                                                            }}
                                                        >
                                                            <TableCell>{getMessageFromMetadata(notification.Metadata)}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={notification.NotificationType}
                                                                    color={getNotificationTypeColor(notification.NotificationType)}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell>{notification.Email}</TableCell>
                                                            <TableCell>{notification.Name}</TableCell>
                                                            <TableCell>{formatDate(notification.CreatedAt)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
                                                            {t('admin.noNotifications')}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
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
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h5" fontWeight={700}
                                    sx={{
                                        background: "linear-gradient(45deg, #1976d2, #2196f3)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    🌐 {t('admin.webNotificationsList')}
                                </Typography>
                                <IconButton 
                                    onClick={() => fetchWebNotifications(webNotificationPage)} 
                                    sx={{
                                        bgcolor: "rgba(33, 150, 243, 0.1)",
                                        "&:hover": { bgcolor: "rgba(33, 150, 243, 0.2)", transform: "rotate(180deg)" },
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            </Box>
                            
                            {loadingWebNotifications ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ 
                                        mb: 3, 
                                        borderRadius: 4,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                        overflow: "hidden"
                                    }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ 
                                                    background: "linear-gradient(135deg, #e3f2fd, #f3e5f5)",
                                                    "& th": { 
                                                        fontWeight: 700, 
                                                        fontSize: "1rem",
                                                        color: "#1976d2",
                                                        borderBottom: "2px solid rgba(33, 150, 243, 0.2)"
                                                    }
                                                }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.message')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.type')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.status')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.email')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.name')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.createdAt')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {webNotifications?.data.notifications?.map((notification, index) => (
                                                    <TableRow key={`web-${notification.UserID}-${index}`}>
                                                        <TableCell>{getMessageFromMetadata(notification.Metadata)}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={notification.NotificationType}
                                                                color={getNotificationTypeColor(notification.NotificationType)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={notification.IsRead ? t('admin.read') : t('admin.unread')}
                                                                color={notification.IsRead ? 'default' : 'warning'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{notification.Email}</TableCell>
                                                        <TableCell>{notification.Name}</TableCell>
                                                        <TableCell>{formatDate(notification.CreatedAt)}</TableCell>
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
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h5" fontWeight={700}
                                    sx={{
                                        background: "linear-gradient(45deg, #1976d2, #2196f3)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    👥 {t('admin.usersList')}
                                </Typography>
                                <IconButton 
                                    sx={{
                                        bgcolor: "rgba(33, 150, 243, 0.1)",
                                        "&:hover": { bgcolor: "rgba(33, 150, 243, 0.2)", transform: "rotate(180deg)" },
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <RefreshIcon color="primary" />
                                </IconButton>
                            </Box>
                            
                            {loadingUsers ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ 
                                        mb: 3, 
                                        borderRadius: 4,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                        overflow: "hidden"
                                    }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ 
                                                    background: "linear-gradient(135deg, #e3f2fd, #f3e5f5)",
                                                    "& th": { 
                                                        fontWeight: 700, 
                                                        fontSize: "1rem",
                                                        color: "#1976d2",
                                                        borderBottom: "2px solid rgba(33, 150, 243, 0.2)"
                                                    }
                                                }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.name')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.email')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.phone')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.accountType')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.createdAt')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {usersList.map((user) => (
                                                    <TableRow key={user.accountsDto?.accountNumber}>
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
                                                                label={user.accountsDto?.accountType || t('admin.standard')}
                                                                color="info"
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        {/*<TableCell>{formatDate(user.createdAt)}</TableCell>*/}
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

                    {adminTab === 3 && (
                        <Box>
                            <Typography variant="h5" fontWeight={700} mb={3}
                                sx={{
                                    background: "linear-gradient(45deg, #1976d2, #2196f3)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                🌱 {t('admin.allInvestmentLots')}
                            </Typography>
                            <TableContainer component={Paper} sx={{ 
                                mb: 3, 
                                borderRadius: 4,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                overflow: "hidden"
                            }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                                            <TableCell>{t('investments.cardTitle')}</TableCell>
                                            <TableCell>{t('investments.status')}</TableCell>
                                            <TableCell>{t('investments.type')}</TableCell>
                                            <TableCell>{t('investments.amount')}</TableCell>
                                            <TableCell>{t('investments.description')}</TableCell>
                                            <TableCell>{t('admin.actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {investmentLots.map((lot) => (
                                            <TableRow key={lot.investmentNumber} 
                                                onClick={() => handleOpenApplications(lot.investmentNumber)} 
                                                sx={{
                                                    cursor: "pointer",
                                                    "&:hover": { 
                                                        backgroundColor: "rgba(76, 175, 80, 0.08)",
                                                        transform: "scale(1.01)"
                                                    },
                                                    transition: "all 0.2s ease",
                                                    "&:nth-of-type(even)": {
                                                        backgroundColor: "rgba(0,0,0,0.02)"
                                                    }
                                                }}
                                            >
                                                <TableCell>#{lot.investmentNumber}</TableCell>
                                                <TableCell>{lot.investmentStatus}</TableCell>
                                                <TableCell>{lot.investmentType}</TableCell>
                                                <TableCell>{lot.sum} USD</TableCell>
                                                <TableCell>{lot.description}</TableCell>
                                                <TableCell>
                                                    {confirmedLotId === lot.investmentNumber || lot.investmentStatus === "OPEN" ? (
                                                        <Typography color="success.main" fontWeight={600}>
                                                            ✅ {t('admin.confirmed')}
                                                        </Typography>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleConfirmLot(lot)}
                                                            sx={{
                                                                background: "linear-gradient(45deg, #4caf50, #81c784)",
                                                                borderRadius: 3,
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                                                                "&:hover": {
                                                                    background: "linear-gradient(45deg, #388e3c, #66bb6a)",
                                                                    transform: "translateY(-2px)",
                                                                    boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)"
                                                                }
                                                            }}
                                                        >
                                                            {t('admin.confirm')}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                {/* <TableCell>{lot.createdAt}</TableCell> */}
                                                <InvestmentApplicationsModal
                                                    open={openApplicationsModal}
                                                    onClose={() => setOpenApplicationsModal(false)}
                                                    applications={applications}
                                                    selectedLotId={selectedLotId}
                                                />
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                px: 4,
                py: 5,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                background: "linear-gradient(135deg, #e8f5e9 0%, #fffde7 50%, #f3e5f5 100%)",
                minHeight: "100vh",
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)",
                    pointerEvents: "none"
                }
            }}
        >
            <Card
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    my: 2,
                    p: 5,
                    borderRadius: 6,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(76, 175, 80, 0.2)",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <Box display="flex" alignItems="center" gap={4} mb={4}>
                    <Avatar
                        src={userInfo.image || '/images/profile2.png'}
                        alt={userInfo.name}
                        sx={{
                            width: 120,
                            height: 120,
                            bgcolor: "#e8f5e9",
                            boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.05)"
                            }
                        }}
                    >
                        <AgricultureIcon sx={{ fontSize: 70, color: "#4caf50" }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={800} 
                            sx={{
                                background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1
                            }}
                        >
                            {userInfo.name} - {userInfo.firstName} {userInfo.lastName}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={500}>
                            {userInfo.email}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                            📱 {userInfo.mobileNumber}
                        </Typography>
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="outlined"
                            sx={{
                                mt: 3,
                                borderRadius: 3,
                                borderColor: "#4caf50",
                                color: "#388e3c",
                                fontWeight: 600,
                                textTransform: "none",
                                px: 3,
                                py: 1,
                                background: "linear-gradient(45deg, rgba(76, 175, 80, 0.05), rgba(255, 193, 7, 0.05))",
                                "&:hover": { 
                                    borderColor: "#388e3c", 
                                    background: "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(255, 193, 7, 0.1))",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            ✏️ {t('personal.editProfile')}
                        </Button>
                        <UpdateProfileModal open={modalOpen} onClose={() => setModalOpen(false)} />
                    </Box>
                </Box>

                <Divider sx={{ my: 4, borderColor: "rgba(76, 175, 80, 0.2)", borderWidth: "2px" }} />

                <Grid container spacing={4} mb={4}>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                            {t('personal.profileNumber')}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#2e7d32">
                            {userInfo.accountsDto?.accountNumber}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                            {t('personal.accountType')}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#2e7d32">
                            {userInfo.accountsDto?.accountType}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: "rgba(76, 175, 80, 0.2)", borderWidth: "2px" }} />

                <Typography variant="h5" mb={3} fontWeight={700}
                    sx={{
                        background: "linear-gradient(45deg, #388e3c, #4caf50)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    🌱 {t('personal.myInvestments')}
                </Typography>
                {userInfo.investmentsLots && userInfo.investmentsLots.length > 0 ? (
                    userInfo.investmentsLots.map((investment: InvestmentLotsDto) => (
                        <Card
                            key={investment.investmentNumber}
                            sx={{
                                mb: 3,
                                borderRadius: 4,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                background: "linear-gradient(135deg, #f1f8e9 0%, #fffde7 50%, #fff3e0 100%)",
                                borderLeft: "6px solid #ffc107",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 32px rgba(0,0,0,0.12)"
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} color="#2e7d32" mb={1}>
                                    #{investment.investmentNumber} — {investment.investmentStatus}
                                </Typography>
                                <Typography variant="h5" color="#fbc02d" fontWeight={700} mb={1}>
                                    💰 {investment.sum} USD
                                </Typography>
                                <Typography color="text.secondary" fontSize="1.1rem">
                                    {investment.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Box 
                        sx={{
                            textAlign: "center",
                            py: 6,
                            borderRadius: 4,
                            background: "linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(255, 193, 7, 0.05))",
                            border: "2px dashed rgba(76, 175, 80, 0.3)"
                        }}
                    >
                        <Typography color="text.secondary" fontSize="1.2rem">
                            {t('personal.noInvestments')}
                        </Typography>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default PersonalInformationPanel;