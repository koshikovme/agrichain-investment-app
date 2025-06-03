import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const features = [
    {
        icon: <VerifiedUserIcon sx={{ fontSize: 40, color: "#4caf50" }} />,
        title: "Блокчейн-прозрачность",
        desc: "Все инвестиции и транзакции защищены и доступны для проверки.",
    },
    {
        icon: <SecurityIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
        title: "Безопасность средств",
        desc: "Ваши активы под надёжной защитой современных технологий.",
    },
    {
        icon: <SpeedIcon sx={{ fontSize: 40, color: "#fbc02d" }} />,
        title: "Быстрые выплаты",
        desc: "Мгновенные переводы и инвестиции без задержек.",
    },
    {
        icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#fbc02d" }} />,
        title: "Выгодные инвестиции",
        desc: "Инвестируйте в агросектор и получайте стабильный доход.",
    },
];

const MainPage: React.FC = () => (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Jumbotron */}
        <Box
            sx={{
                minHeight: 420,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)",
                textAlign: "center",
                py: 3,
                px: 3,
            }}
        >
            <img
                src="/images/agrichain_logo_no_text.svg"
                alt="AgriChain Logo"
                style={{ width: 80, marginBottom: 20 }}
            />
            <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    mb: 2,
                    color: "#2e7d32",
                    letterSpacing: 1,
                }}
            >
                AgriChain — инвестиции в сельское хозяйство на блокчейне
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: "#616161",
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: 700,
                    mx: "auto",
                }}
            >
                Прозрачные и безопасные инвестиции в агросектор. Используйте возможности блокчейна для роста вашего капитала и поддержки фермеров.
            </Typography>
            <Button
                variant="contained"
                size="large"
                sx={{
                    bgcolor: "#4caf50",
                    color: "#fff",
                    borderRadius: 3,
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: 18,
                    boxShadow: "0 4px 20px 0 rgba(76,175,80,0.08)",
                    "&:hover": { bgcolor: "#388e3c" },
                    textTransform: "none",
                }}
                href="/investments"
            >
                Начать инвестировать
            </Button>
        </Box>

        {/* Features */}
        <Box sx={{ maxWidth: 1800, mx: "auto", mt: 7, px: 2 }}>
            <Grid container spacing={4} justifyContent="center">
                {features.map((f, i) => (
                    <Grid key={i}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: 2,
                                textAlign: "center",
                                py: 2,
                                px: 2,
                                height: 200,
                                width: 350,
                                transition: "box-shadow 0.2s",
                                "&:hover": { boxShadow: 6 },
                                background: "linear-gradient(135deg, #f1f8e9 60%, #fffde7 100%)",
                            }}
                        >
                            <CardContent>
                                {f.icon}
                                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1, color: "#2e7d32" }}>
                                    {f.title}
                                </Typography>
                                <Typography color="text.secondary">{f.desc}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Box>
);

export default MainPage;