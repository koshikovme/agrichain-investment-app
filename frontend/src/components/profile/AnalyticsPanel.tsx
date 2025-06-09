import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme, useMediaQuery } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useTranslation } from 'react-i18next';

const COLORS = ['#4caf50', '#2196f3', '#ffc107', '#ff9800', '#9c27b0', '#f44336'];

interface ByTypeStat { type: string; value: number; }
interface ByMonthStat { month: string; sum: number; }
interface AnalyticsPanelProps {
  stats: {
    byType: ByTypeStat[];
    byMonth: ByMonthStat[];
  };
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Grid container spacing={4} sx={{
        background: "linear-gradient(135deg, #e8f5e9 0%, #fffde7 50%, #f3e5f5 100%)", 
        borderRadius: 4,
        p: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(76, 175, 80, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          borderRadius: 4
        }
      }}>
        <Grid size={6} sx={{ p: 2 }}>
          <Card sx={{
            borderRadius: 6,
            boxShadow: "0 12px 28px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
            minHeight: 380,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(76, 175, 80, 0.2)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 16px 36px rgba(0,0,0,0.15), 0 6px 16px rgba(0,0,0,0.08)"
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={800} mb={3}
                sx={{
                  background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                📊 {t('analytics.distributionByType')}
              </Typography>
              <Box sx={{ width: "100%", height: isMobile ? 240 : 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byType}
                      dataKey="value"
                      nameKey="type"
                      outerRadius={isMobile ? 80 : 100}
                      innerRadius={isMobile ? 40 : 50}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {stats.byType.map((entry, idx) => (
                        <Cell 
                          key={entry.type} 
                          fill={COLORS[idx % COLORS.length]}
                          stroke="rgba(255,255,255,0.8)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(76, 175, 80, 0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={6} sx={{ p: 2 }}>
          <Card sx={{
            borderRadius: 6,
            boxShadow: "0 12px 28px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
            minHeight: 380,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(33, 150, 243, 0.2)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 16px 36px rgba(0,0,0,0.15), 0 6px 16px rgba(0,0,0,0.08)"
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={800} mb={3}
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                📈 {t('analytics.investmentDynamics')}
              </Typography>
              <Box sx={{ width: "100%", height: isMobile ? 240 : 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.byMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(33, 150, 243, 0.3)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sum" 
                      stroke="#2196f3" 
                      strokeWidth={3}
                      dot={{ fill: '#2196f3', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#2196f3', strokeWidth: 2, fill: '#fff' }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};