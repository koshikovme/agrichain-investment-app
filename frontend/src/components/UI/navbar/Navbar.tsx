import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    useTheme,
    useMediaQuery,
    Badge,
    Popover,
    Menu,
    MenuItem,
    Avatar,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { keycloak } from "../../../features/auth/keycloak";
import { logout as logoutAction } from "../../../features/auth/authSlice";
import { useNotificationWebSocket, WebNotification } from "../../../features/notification/useNotificationWebSocket";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.reducer.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.reducer.user);

    const {
        notifications,
        open: notifOpen,
        setOpen: setNotifOpen,
        markAsRead,
    } = useNotificationWebSocket(user.userInfo?.accountsDto?.accountNumber);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [notifAnchor, setNotifAnchor] = React.useState<null | HTMLElement>(null);
    const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
    const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);

    // Language menu handlers
    const handleLangMenu = (event: React.MouseEvent<HTMLElement>) => setLangAnchor(event.currentTarget);
    const handleLangClose = () => setLangAnchor(null);
    const handleLangChange = (lng: string) => {
        i18n.changeLanguage(lng);
        setLangAnchor(null);
    };

    // Profile menu handlers
    const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget);
    const handleProfileClose = () => setProfileAnchor(null);

    const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

    // Notification handlers
    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchor(event.currentTarget);
        setNotifOpen(true);
    };

    const handleNotifClose = () => {
        setNotifAnchor(null);
        setNotifOpen(false);
    };

    // Main navigation items (only for authenticated users)
    const mainNavItems = [
        {
            label: t("navbar.investments"),
            to: "/investments",
        },
        {
            label: t("navbar.transactions"),
            to: "/transactions",
        },
    ];

    // Profile menu items
    const profileMenuItems = [
        {
            label: t("navbar.profile"),
            onClick: () => {
                navigate("/profile");
                handleProfileClose();
            },
        },
        {
            label: t("navbar.logout"),
            onClick: () => {
                keycloak.logout();
                dispatch(logoutAction());
                handleProfileClose();
            },
        },
    ];

    // Auth buttons for non-authenticated users
    const authButtons = [
        {
            label: t("navbar.login"),
            onClick: () => keycloak.login({ redirectUri: window.location.origin }),
            variant: "outlined" as const,
        },
        {
            label: t("navbar.register"),
            onClick: () => keycloak.register({ redirectUri: window.location.origin }),
            variant: "contained" as const,
        },
    ];

    return (
        <AppBar
            position="fixed"
            elevation={2}
            sx={{
                background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)",
                boxShadow: "0 2px 12px 0 rgba(76,175,80,0.08)",
            }}
        >
            <Toolbar sx={{ px: 2, justifyContent: "space-between" }}>
                {/* Left: Logo */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        sx={{
                            textTransform: "none",
                            borderRadius: 12,
                            fontSize: "32px",
                            fontWeight: 600,
                            px: 2,
                            py: 1,
                            fontFamily:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            color: "#2e7d32",
                            background: "transparent",
                            "&:hover": { background: "rgba(76,175,80,0.08)" },
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src="/images/agrichain_logo_no_text.svg"
                            alt="AgriChain Logo"
                            style={{ width: 28, marginRight: 8 }}
                        />
                        AgriChain
                    </Button>
                </Box>

                {/* Center: Main Navigation (only for authenticated users on desktop) */}
                {isAuthenticated && !isMobile && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {mainNavItems.map((item) => (
                            <Button
                                key={item.label}
                                color="inherit"
                                component={Link}
                                to={item.to}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 12,
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                    color: "#2e7d32",
                                    "&:hover": { background: "rgba(46,125,50,0.08)" },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* Right: User Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* Language Switcher */}
                    <Button
                        color="inherit"
                        onClick={handleLangMenu}
                        sx={{
                            minWidth: 60,
                            color: "#2e7d32",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 12,
                            "&:hover": { background: "rgba(46,125,50,0.08)" },
                        }}
                    >
                        {i18n.language === "ru" ? "Рус" : i18n.language === "kz" ? "Қаз" : "Eng"}
                    </Button>
                    <Menu
                        anchorEl={langAnchor}
                        open={Boolean(langAnchor)}
                        onClose={handleLangClose}
                        PaperProps={{
                            sx: { borderRadius: 2, minWidth: 120 },
                        }}
                    >
                        <MenuItem onClick={() => handleLangChange("ru")}>Русский</MenuItem>
                        <MenuItem onClick={() => handleLangChange("kz")}>Қазақша</MenuItem>
                        <MenuItem onClick={() => handleLangChange("en")}>English</MenuItem>
                    </Menu>

                    {isAuthenticated ? (
                        <>
                            {/* Notifications */}
                            {user.userInfo?.accountsDto?.accountNumber && (
                                <>
                                    <IconButton
                                        color="inherit"
                                        onClick={handleNotifClick}
                                        sx={{
                                            color: "#2e7d32",
                                            "&:hover": { background: "rgba(46,125,50,0.08)" },
                                        }}
                                    >
                                        <Badge
                                            color="error"
                                            variant="dot"
                                            invisible={notifications.length === 0}
                                            overlap="circular"
                                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                        >
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    <Popover
                                        open={notifOpen && Boolean(notifAnchor)}
                                        anchorEl={notifAnchor}
                                        onClose={handleNotifClose}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        PaperProps={{
                                            sx: { minWidth: 320, maxWidth: 400, p: 2, borderRadius: 3 },
                                        }}
                                    >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                            <Typography variant="h6" sx={{ color: "#2e7d32" }}>
                                                {t("navbar.notifications")}
                                            </Typography>
                                            <IconButton size="small" onClick={handleNotifClose}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                        {notifications.length === 0 ? (
                                            <Typography variant="body2" sx={{ color: "#888" }}>
                                                {t("navbar.noNotifications")}
                                            </Typography>
                                        ) : (
                                            notifications.map((notif: WebNotification) => (
                                                <Box
                                                    key={notif.id}
                                                    sx={{
                                                        mb: 2,
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        background: "#f1f8e9",
                                                        boxShadow: "0 1px 4px 0 rgba(76,175,80,0.08)",
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#388e3c" }}>
                                                        {notif.subject}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: "#333", mt: 0.5, whiteSpace: "pre-line" }}
                                                        dangerouslySetInnerHTML={{ __html: notif.body.replace(/\n/g, "<br />") }}
                                                    />
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mt: 1, color: "#2e7d32", borderColor: "#2e7d32" }}
                                                        onClick={() => markAsRead(notif.id)}
                                                    >
                                                        {t("navbar.markAsRead")}
                                                    </Button>
                                                </Box>
                                            ))
                                        )}
                                    </Popover>
                                </>
                            )}

                            {/* Mobile Menu or Profile Menu */}
                            {isMobile ? (
                                <>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={handleDrawerToggle}
                                        sx={{
                                            color: "#2e7d32",
                                            "&:hover": { background: "rgba(46,125,50,0.08)" },
                                        }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Drawer
                                        anchor="right"
                                        open={drawerOpen}
                                        onClose={handleDrawerToggle}
                                        PaperProps={{
                                            sx: { width: 280, borderRadius: "16px 0 0 16px" },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 280,
                                                pt: 2,
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "100%",
                                            }}
                                            role="presentation"
                                            onClick={handleDrawerToggle}
                                            onKeyDown={handleDrawerToggle}
                                        >
                                            <List>
                                                {/* Main Navigation */}
                                                {mainNavItems.map((item) => (
                                                    <ListItem key={item.label} disablePadding>
                                                        <ListItemButton
                                                            component={Link}
                                                            to={item.to}
                                                            sx={{
                                                                color: "#2e7d32",
                                                                "&:hover": { background: "rgba(46,125,50,0.08)" },
                                                                borderRadius: 2,
                                                                mx: 1,
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={item.label}
                                                                primaryTypographyProps={{ fontWeight: 600 }}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                                <Divider sx={{ my: 1 }} />
                                                {/* Profile Menu */}
                                                {profileMenuItems.map((item) => (
                                                    <ListItem key={item.label} disablePadding>
                                                        <ListItemButton
                                                            onClick={item.onClick}
                                                            sx={{
                                                                color: "#2e7d32",
                                                                "&:hover": { background: "rgba(46,125,50,0.08)" },
                                                                borderRadius: 2,
                                                                mx: 1,
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={item.label}
                                                                primaryTypographyProps={{ fontWeight: 600 }}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Drawer>
                                </>
                            ) : (
                                /* Desktop Profile Menu */
                                <>
                                    <IconButton
                                        color="inherit"
                                        onClick={handleProfileMenu}
                                        sx={{
                                            color: "#2e7d32",
                                            "&:hover": { background: "rgba(46,125,50,0.08)" },
                                        }}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={profileAnchor}
                                        open={Boolean(profileAnchor)}
                                        onClose={handleProfileClose}
                                        PaperProps={{
                                            sx: { borderRadius: 2, minWidth: 160 },
                                        }}
                                    >
                                        {profileMenuItems.map((item) => (
                                            <MenuItem key={item.label} onClick={item.onClick}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            )}
                        </>
                    ) : (
                        /* Auth Buttons for non-authenticated users */
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {authButtons.map((button) => (
                                <Button
                                    key={button.label}
                                    variant={button.variant}
                                    onClick={button.onClick}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 12,
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        px: 2,
                                        py: 1,
                                        color: button.variant === "outlined" ? "#2e7d32" : "#fff",
                                        borderColor: button.variant === "outlined" ? "#2e7d32" : undefined,
                                        backgroundColor: button.variant === "contained" ? "#2e7d32" : undefined,
                                        "&:hover": {
                                            background:
                                                button.variant === "outlined"
                                                    ? "rgba(46,125,50,0.08)"
                                                    : "#1b5e20",
                                            borderColor: "#2e7d32",
                                        },
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;