import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { keycloak } from "../../../features/auth/keycloak";
import { logout as logoutAction } from "../../../features/auth/authSlice";
import { useNotificationWebSocket } from "../../../features/notification/useNotificationWebSocket";
import AgricultureIcon from "@mui/icons-material/Agriculture";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.reducer.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.reducer.user);

    useNotificationWebSocket(user.userInfo.accountsDto.accountNumber);

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
                <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                    <AgricultureIcon sx={{ color: "#4caf50", fontSize: 38, mr: 1 }} />
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
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            color: "#2e7d32",
                            background: "transparent",
                            "&:hover": { background: "rgba(76,175,80,0.08)" },
                        }}
                    >
                        AgriChain
                    </Button>
                </Typography>
                <Button
                    color="inherit"
                    sx={{
                        textTransform: "none",
                        borderRadius: 12,
                        fontSize: "16px",
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: "#388e3c",
                        "&:hover": { background: "rgba(76,175,80,0.08)" },
                    }}
                    onClick={() => {
                        if (!keycloak.token) {
                            keycloak.login({ redirectUri: window.location.origin + "/profile" });
                        } else {
                            navigate("/profile");
                        }
                    }}
                >
                    Профиль
                </Button>
                <Button
                    color="inherit"
                    component={Link}
                    to="/investments"
                    sx={{
                        textTransform: "none",
                        borderRadius: 12,
                        fontSize: "16px",
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: "#388e3c",
                        "&:hover": { background: "rgba(76,175,80,0.08)" },
                    }}
                >
                    Инвестиции
                </Button>
                <Button
                    color="inherit"
                    component={Link}
                    to="/transactions"
                    sx={{
                        textTransform: "none",
                        borderRadius: 12,
                        fontSize: "16px",
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: "#388e3c",
                        "&:hover": { background: "rgba(76,175,80,0.08)" },
                    }}
                >
                    Транзакции
                </Button>
                {isAuthenticated ? (
                    <Button
                        color="inherit"
                        onClick={() => {
                            keycloak.logout();
                            dispatch(logoutAction());
                        }}
                        sx={{
                            textTransform: "none",
                            borderRadius: 12,
                            fontSize: "16px",
                            fontWeight: 500,
                            px: 2,
                            py: 1,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            color: "#388e3c",
                            "&:hover": { background: "rgba(76,175,80,0.08)" },
                        }}
                    >
                        Выйти
                    </Button>
                ) : (
                    <>
                        <Button
                            color="inherit"
                            sx={{
                                textTransform: "none",
                                borderRadius: 12,
                                fontSize: "16px",
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                color: "#388e3c",
                                "&:hover": { background: "rgba(76,175,80,0.08)" },
                            }}
                            onClick={() => keycloak.login({ redirectUri: window.location.origin })}
                        >
                            Войти
                        </Button>
                        <Button
                            color="inherit"
                            sx={{
                                textTransform: "none",
                                borderRadius: 12,
                                fontSize: "16px",
                                fontWeight: 500,
                                px: 2,
                                py: 1,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                color: "#388e3c",
                                "&:hover": { background: "rgba(76,175,80,0.08)" },
                            }}
                            onClick={() => keycloak.register({ redirectUri: window.location.origin })}
                        >
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;