import React from "react";
import { Box, Typography, Link, Container, Button, TextField } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: { xs: 4, md: 6 },
      px: { xs: 1, md: 3 },
      background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)",
      borderTop: "1px solid #c8e6c9",
      fontFamily: "'Gothic A1', Arial, sans-serif",
    }}
  >
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      {/* Left: Logo & Info */}
      <Box display="flex" flexDirection="column" gap={2} minWidth={240}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <img src="/images/agrichain_logo_no_text.svg" alt="AgriChain" style={{ width: 40 }} />
          <Typography variant="h5" color="#388e3c" fontWeight={800} sx={{ letterSpacing: 1 }}>
            AgriChain
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, fontSize: 18 }}>
          Прозрачные инвестиции в агросектор на блокчейне. Поддержите фермеров — инвестируйте в будущее!
        </Typography>
      </Box>

      {/* Center: Навигация и Контакты */}
      <Box display="flex" flexWrap="wrap" gap={{ xs: 6, md: 10 }}>
        <Box>
          <Typography variant="subtitle1" color="#6b8e23" fontWeight={700} mb={2} sx={{ fontSize: 20 }}>
            Разделы
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <li>
              <Link href="/investments" color="#2e7d32" underline="hover" fontWeight={700} sx={{ fontSize: 18 }}>
                Инвестиции
              </Link>
            </li>
            <li>
              <Link href="/transactions" color="#2e7d32" underline="hover" fontWeight={700} sx={{ fontSize: 18 }}>
                Транзакции
              </Link>
            </li>
            <li>
              <Link href="/profile" color="#2e7d32" underline="hover" fontWeight={700} sx={{ fontSize: 18 }}>
                Профиль
              </Link>
            </li>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1" color="#6b8e23" fontWeight={700} mb={2} sx={{ fontSize: 20 }}>
            Связаться с нами
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <li>
              <Link href="mailto:support@agrichain.kz" color="#2e7d32" underline="hover" fontWeight={700} sx={{ fontSize: 18 }}>
                Поддержка
              </Link>
            </li>
            <li>
              <Link href="https://t.me/agrichain_support" color="#2e7d32" underline="hover" fontWeight={700} target="_blank" rel="noopener" sx={{ fontSize: 18 }}>
                Telegram
              </Link>
            </li>
          </Box>
        </Box>
      </Box>

      {/* Right: Подписка на новости */}
      <Box sx={{ minWidth: 280 }}>
        <Typography variant="subtitle1" color="#6b8e23" fontWeight={700} mb={2} sx={{ fontSize: 20 }}>
          Получать новости
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            gap: 1,
            borderBottom: "1px solid #6b8e23",
            pb: 1,
          }}
        >
          <TextField
            variant="standard"
            placeholder="Ваш email"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: "'Gothic A1', Arial, sans-serif",
                fontSize: 17,
                color: "#2f4f4f",
              },
            }}
            sx={{ flex: 1, bgcolor: "transparent" }}
          />
          <Button
            type="submit"
            sx={{
              minWidth: 0,
              px: 1.5,
              color: "#6b8e23",
              borderRadius: 2,
              fontWeight: 700,
              fontFamily: "'Gothic A1', Arial, sans-serif",
              "&:hover": { bgcolor: "rgba(107,142,35,0.08)" },
            }}
          >
            <svg width="28" height="16" viewBox="0 0 41 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40.002 11.001H0.501953M40.002 11.001L30.002 1.00098M40.002 11.001L30.002 21.001" stroke="#6b8e23" strokeWidth="2"/>
            </svg>
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" mt={1} sx={{ fontSize: 15 }}>
          Мы не рассылаем спам
        </Typography>
      </Box>
    </Container>

    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={2}>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16 }}>
          © {new Date().getFullYear()} AgriChain. Все права защищены.
        </Typography>
        <Box display="flex" gap={3}>
          <Link href="#" color="text.secondary" underline="hover" fontSize={16} fontWeight={600}>
            Политика конфиденциальности
          </Link>
          <Link href="#" color="text.secondary" underline="hover" fontSize={16} fontWeight={600}>
            Условия использования
          </Link>
        </Box>
      </Box>
    </Container>
  </Box>
);

export default Footer;