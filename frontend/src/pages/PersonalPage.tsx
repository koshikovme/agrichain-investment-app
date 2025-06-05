import React from "react";
import PersonalInformationPanel from "../components/profile/PersonalInformationPanel";
import { useTranslation } from "react-i18next";

const PersonalPage = () => {
    const { t } = useTranslation();
    return (
        <div style={{ padding: 24 }}>
            <PersonalInformationPanel />
        </div>
    );
};

export default PersonalPage;