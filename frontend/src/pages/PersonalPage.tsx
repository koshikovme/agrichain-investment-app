import React, { useMemo } from "react";
import PersonalInformationPanel from "../components/profile/PersonalInformationPanel";
import { useTranslation } from "react-i18next";
import { AnalyticsPanel } from "../components/profile/AnalyticsPanel";
import { Box } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { InvestmentLotsDto } from "../features/investment/investmentTypes";
import { format, parseISO } from "date-fns";
import AchievementPanel from "../components/profile/AchievementPanel";

const PersonalPage = () => {
    const { t } = useTranslation();
    const { investmentLots } = useAppSelector((state) => state.reducer.investment);

    // Группировка по типу
    const byType = useMemo(() => {
        const map: Record<string, number> = {};
        investmentLots.forEach((lot: InvestmentLotsDto) => {
            map[lot.investmentType] = (map[lot.investmentType] || 0) + lot.sum;
        });
        return Object.entries(map).map(([type, value]) => ({ type, value }));
    }, [investmentLots]);

    // Группировка по месяцам (по дате deadline)
    const byMonth = useMemo(() => {
        const map: Record<string, number> = {};
        investmentLots.forEach((lot: InvestmentLotsDto) => {
            if (lot.deadline) {
                const month = format(parseISO(lot.deadline), "MMM yyyy");
                map[month] = (map[month] || 0) + lot.sum;
            }
        });
        // Сортировка по дате
        return Object.entries(map)
            .map(([month, sum]) => ({ month, sum }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    }, [investmentLots]);

    return (
        <div>
            <Box>
                <PersonalInformationPanel />
                <AnalyticsPanel stats={{ byType, byMonth }} />
                <AchievementPanel investmentsCount={investmentLots.length}/>
            </Box>
        </div>
    );
};

export default PersonalPage;