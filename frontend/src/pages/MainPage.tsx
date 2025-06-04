import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HeroSection from '../components/UI/hero/HeroSection';
import Reviews from '../components/UI/reviews/Reviews'
import HowItWorks from '../components/UI/howItWorks/HowItWorks'

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

        <Box
            sx={{
                minHeight: { xs: 320, sm: 420 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)",
                textAlign: "center",
                py: { xs: 2, sm: 3 },
                px: { xs: 1, sm: 3 },
            }}
        >
            <img
                src="/images/agrichain_logo_no_text.svg"
                alt="AgriChain Logo"
                style={{ width: "60px", marginBottom: 16, maxWidth: "20vw" }}
            />
            <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    mb: { xs: 1, sm: 2 },
                    color: "#2e7d32",
                    letterSpacing: 1,
                    fontSize: { xs: 22, sm: 32 },
                }}
            >
                AgriChain — инвестиции в сельское хозяйство на блокчейне
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    color: "#616161",
                    mb: { xs: 2, sm: 4 },
                    fontWeight: 400,
                    maxWidth: 700,
                    mx: "auto",
                    fontSize: { xs: 15, sm: 20 },
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
                    px: { xs: 3, sm: 5 },
                    py: { xs: 1, sm: 1.5 },
                    fontWeight: 600,
                    fontSize: { xs: 16, sm: 18 },
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
        <Box sx={{ maxWidth: 1800, mx: "auto", mt: { xs: 4, sm: 6 }, px: { xs: 1, sm: 2 } }}>
            <Grid container spacing={3} justifyContent="center">
                {features.map((f, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: { xs: "100%", sm: "50%", md: "23%" },
                            display: "flex",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: 2,
                                textAlign: "center",
                                py: 2,
                                px: 2,
                                height: { xs: 180, sm: 200 },
                                width: { xs: "100%", sm: 320, md: 350 },
                                transition: "box-shadow 0.2s",
                                "&:hover": { boxShadow: 6 },
                                background: "linear-gradient(135deg, #f1f8e9 60%, #fffde7 100%)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                mx: "auto",
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                {f.icon}
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                        mt: 2,
                                        mb: 1,
                                        color: "#2e7d32",
                                        fontSize: { xs: 17, sm: 20 },
                                    }}
                                >
                                    {f.title}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                                    {f.desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Grid>
        </Box>
        {/* Hero Section */}
        <HeroSection />
        {/* Reviews */}
        <Reviews />
        {/** How it works */}
        <HowItWorks />
    </Box>


);

export default MainPage;