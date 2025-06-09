// frontend/src/components/profile/AchievementPanel.tsx
import React from "react";
import { Box, Typography, Chip, Card, CardContent } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTranslation } from "react-i18next";

interface AchievementPanelProps {
    investmentsCount: number;
}

const AchievementPanel: React.FC<AchievementPanelProps> = ({ investmentsCount }) => {
    const { t } = useTranslation();
    
    const getAchievements = () => {
        const achievements = [];
        
        if (investmentsCount >= 1) {
            achievements.push({
                icon: <StarIcon sx={{ color: "#ffc107" }} />,
                label: t('achievements.firstInvestor'),
                description: t('achievements.firstInvestorDesc'),
                color: "warning" as const
            });
        }
        
        if (investmentsCount >= 5) {
            achievements.push({
                icon: <EmojiEventsIcon sx={{ color: "#ff9800" }} />,
                label: t('achievements.activeInvestor'),
                description: t('achievements.activeInvestorDesc'),
                color: "warning" as const
            });
        }
        
        if (investmentsCount >= 10) {
            achievements.push({
                icon: <TrendingUpIcon sx={{ color: "#4caf50" }} />,
                label: t('achievements.professionalInvestor'),
                description: t('achievements.professionalInvestorDesc'),
                color: "success" as const
            });
        }
        
        return achievements;
    };

    const achievements = getAchievements();

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Card sx={{
                borderRadius: 6,
                boxShadow: "0 12px 28px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
                background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 193, 7, 0.2)",
                position: "relative",
                overflow: "hidden"
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={800} mb={3}
                        sx={{
                            background: "linear-gradient(45deg, #ff9800, #ffc107)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        🏆 {t('achievements.title')}
                    </Typography>
                    {achievements.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {achievements.map((achievement, index) => (
                                <Chip
                                    key={index}
                                    icon={achievement.icon}
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight={700}>
                                                {achievement.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {achievement.description}
                                            </Typography>
                                        </Box>
                                    }
                                    color={achievement.color}
                                    sx={{ 
                                        fontWeight: 600, 
                                        fontSize: "1rem", 
                                        py: 3,
                                        px: 2,
                                        borderRadius: 4,
                                        boxShadow: "0 4px 12px rgba(255, 193, 7, 0.3)",
                                        background: "linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))",
                                        border: "1px solid rgba(255, 193, 7, 0.3)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px) scale(1.05)",
                                            boxShadow: "0 8px 20px rgba(255, 193, 7, 0.4)"
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Box 
                            sx={{
                                textAlign: "center",
                                py: 4,
                                borderRadius: 4,
                                background: "linear-gradient(135deg, rgba(255, 193, 7, 0.05), rgba(255, 152, 0, 0.05))",
                                border: "2px dashed rgba(255, 193, 7, 0.3)"
                            }}
                        >
                            <Typography color="text.secondary" fontSize="1.1rem" fontWeight={500}>
                                🌟 {t('achievements.noAchievements')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                {t('achievements.getFirstAchievement')}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AchievementPanel;