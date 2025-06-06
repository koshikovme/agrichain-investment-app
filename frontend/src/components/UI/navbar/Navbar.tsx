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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { keycloak } from "../../../features/auth/keycloak";
import { logout as logoutAction } from "../../../features/auth/authSlice";
import { useNotificationWebSocket, WebNotification } from "../../../features/notification/useNotificationWebSocket";
import AgricultureIcon from "@mui/icons-material/Agriculture";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.reducer.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.reducer.user);

    const {
        notifications,
        open: notifOpen,
        setOpen: setNotifOpen,
        markAsRead,
    } = useNotificationWebSocket(user.userInfo.accountsDto.accountNumber);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [notifAnchor, setNotifAnchor] = React.useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotifAnchor(event.currentTarget);
        setNotifOpen(true);
    };

    const handleNotifClose = () => {
        setNotifAnchor(null);
        setNotifOpen(false);
    };

    const navItems = [
        {
            label: "Профиль",
            onClick: () => {
                if (!keycloak.token) {
                    keycloak.login({ redirectUri: window.location.origin + "/profile" });
                } else {
                    navigate("/profile");
                }
            },
        },
        {
            label: "Инвестиции",
            to: "/investments",
        },
        {
            label: "Транзакции",
            to: "/transactions",
        },
    ];

    const authItems = isAuthenticated
        ? [
              {
                  label: "Выйти",
                  onClick: () => {
                      keycloak.logout();
                      dispatch(logoutAction());
                  },
              },
          ]
        : [
              {
                  label: "Войти",
                  onClick: () => keycloak.login({ redirectUri: window.location.origin }),
              },
              {
                  label: "Регистрация",
                  onClick: () => keycloak.register({ redirectUri: window.location.origin }),
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
            <Toolbar sx={{ px: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <img
                        src="/images/agrichain_logo_no_text.svg"
                        alt="AgriChain Logo"
                        style={{ width: 28, marginRight: 8 }}
                    />
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
                        }}
                    >
                        AgriChain
                    </Button>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isAuthenticated && user.userInfo?.accountsDto?.accountNumber && (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={handleNotifClick}
                                sx={{ mr: 1, color: "#2e7d32", position: "relative" }}
                            >
                                <Badge
                                    color="error"
                                    variant="dot"
                                    invisible={notifications.length === 0}
                                    overlap="circular"
                                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                >
                                    <NotificationsIcon fontSize="large" />
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
                                    <Typography variant="h6" sx={{ color: "#2e7d32" }}>Уведомления</Typography>
                                    <IconButton size="small" onClick={handleNotifClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                {notifications.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: "#888" }}>Нет новых уведомлений</Typography>
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
                                                Прочитано
                                            </Button>
                                        </Box>
                                    ))
                                )}
                            </Popover>
                        </>
                    )}
                </Box>
                {isMobile ? (
                    <>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{ ml: 1, color: "#2e7d32" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={handleDrawerToggle}
                            PaperProps={{
                                sx: { width: 240 },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 240,
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
                                    {navItems.map((item, idx) =>
                                        item.to ? (
                                            <ListItem key={item.label} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={item.to}
                                                    sx={{
                                                        color: "#2e7d32",
                                                        "&:hover": { background: "rgba(46,125,50,0.08)" },
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{ fontWeight: "bold" }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ) : (
                                            <ListItem key={item.label} disablePadding>
                                                <ListItemButton
                                                    onClick={item.onClick}
                                                    sx={{
                                                        color: "#2e7d32",
                                                        "&:hover": { background: "rgba(46,125,50,0.08)" },
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{ fontWeight: "bold" }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    )}
                                    {authItems.map((item) => (
                                        <ListItem key={item.label} disablePadding>
                                            <ListItemButton
                                                onClick={item.onClick}
                                                sx={{
                                                    color: "#2e7d32",
                                                    "&:hover": { background: "rgba(46,125,50,0.08)" },
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.label}
                                                    primaryTypographyProps={{ fontWeight: "bold" }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    <>
                        {navItems.map((item) =>
                            item.to ? (
                                <Button
                                    key={item.label}
                                    color="inherit"
                                    component={Link}
                                    to={item.to}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 12,
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        px: 2,
                                        py: 1,
                                        fontFamily:
                                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                        color: "#2e7d32",
                                        "&:hover": { background: "rgba(46,125,50,0.08)" },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ) : (
                                <Button
                                    key={item.label}
                                    color="inherit"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 12,
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        px: 2,
                                        py: 1,
                                        fontFamily:
                                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                        color: "#2e7d32",
                                        "&:hover": { background: "rgba(46,125,50,0.08)" },
                                    }}
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </Button>
                            )
                        )}
                        {authItems.map((item) => (
                            <Button
                                key={item.label}
                                color="inherit"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 12,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    px: 2,
                                    py: 1,
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                    color: "#2e7d32",
                                    "&:hover": { background: "rgba(46,125,50,0.08)" },
                                }}
                                onClick={item.onClick}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;