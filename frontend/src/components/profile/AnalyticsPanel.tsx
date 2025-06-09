import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme, useMediaQuery } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";


const COLORS = ['#388e3c', '#bfa046', '#fbc02d', '#1976d2'];

interface ByTypeStat { type: string; value: number; }
interface ByMonthStat { month: string; sum: number; }
interface AnalyticsPanelProps {
  stats: {
    byType: ByTypeStat[];
    byMonth: ByMonthStat[];
  };
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={3} sx={{background: "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)", mt: 2}}>
      <Grid size={6} sx={{ mt: isMobile ? 0 : 2, mb: isMobile ? 0 : 4}}>
        <Card sx={{
          borderRadius: 4,
          boxShadow: 3,
          minHeight: 320,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: "linear-gradient(135deg, #f1f8e9 80%, #fffde7 100%)",
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#2e7d32" mb={2}>
              Распределение по типам
            </Typography>
            <Box sx={{ width: "100%", height: isMobile ? 220 : 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byType}
                    dataKey="value"
                    nameKey="type"
                    outerRadius={isMobile ? 70 : 80}
                    label
                  >
                    {stats.byType.map((entry, idx) => (
                      <Cell key={entry.type} fill={ COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={6} sx={{ mt: isMobile ? 0 : 2, mb: isMobile ? 0 : 4 }}>
        <Card sx={{
          borderRadius: 4,
          boxShadow: 3,
          minHeight: 320,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: "linear-gradient(135deg, #f1f8e9 80%, #fffde7 100%)",
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} color="#2e7d32" mb={2}>
              Динамика инвестиций
            </Typography>
            <Box sx={{ width: "100%", height: isMobile ? 220 : 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.byMonth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sum" stroke="#388e3c" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};