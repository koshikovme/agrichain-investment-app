import React from "react";
import PersonalInformationPanel from "../components/profile/PersonalInformationPanel";
import { useTranslation } from "react-i18next";
import {AnalyticsPanel} from "../components/AnalyticsPanel";

const PersonalPage = () => {
    const { t } = useTranslation();
    return (
        <div style={{ padding: 24 }}>
            <PersonalInformationPanel />
            <AnalyticsPanel stats={
                {
                    byType: [
                        { type: "CATTLE", value: 12000 },
                        { type: "LAND", value: 8000 },
                        { type: "EQUIPMENT", value: 5000 },
                        { type: "CASH", value: 3000 }
                    ],
                    byMonth: [
                        { month: "Jan", sum: 5000 },
                        { month: "Feb", sum: 7000 },
                        { month: "Mar", sum: 6000 },
                        { month: "Apr", sum: 8000 }
                    ]
                }
            }/>
        </div>
    );
};

export default PersonalPage;