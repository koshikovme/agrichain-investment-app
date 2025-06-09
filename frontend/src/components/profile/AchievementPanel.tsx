// frontend/src/components/profile/AchievementPanel.tsx
import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface AchievementPanelProps {
    investmentsCount: number;
}

const AchievementPanel: React.FC<AchievementPanelProps> = ({ investmentsCount }) => {
    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h6" color="#388e3c" fontWeight={700} mb={1}>
                Достижения
            </Typography>
            {investmentsCount >= 2 ? (
                <Chip
                    icon={<EmojiEventsIcon style={{ color: "#fbc02d" }} />}
                    label="Инвестор ⭐ (5+ инвестиций)"
                    color="warning"
                    sx={{ fontWeight: 600, fontSize: 16, mr: 2 }}
                />
            ) : (
                <Typography color="text.secondary">Пока нет достижений</Typography>
            )}
        </Box>
    );
};

export default AchievementPanel;