import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createInvestmentApplication } from "../../features/investment/investmentsSlice";
import { useTranslation } from "react-i18next";
import FileUpload from "../upload/FileUpload";
import { Alert, Typography } from "@mui/material";
import { uploadFile } from "../../features/upload/uploadSlice";

export const ApplyInvestmentModal = ({
    open,
    onClose,
    investmentNumber
}: {
    open: boolean,
    onClose: () => void,
    investmentNumber: number
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.reducer.user);
    const upload = useAppSelector((state) => state.reducer.upload);

    const [proposalText, setProposalText] = useState("");
    const [expectedProfit, setExpectedProfit] = useState("");
    const [documentsUrl, setDocumentsUrl] = useState<string>("");

    // Обновляем documentsUrl после успешной загрузки файла
    useEffect(() => {
        if (upload.success && upload.fileUrl) {
            setDocumentsUrl(upload.fileUrl);
        }
    }, [upload.success, upload.fileUrl]);

    const handleFileUpload = async (file: File) => {
        await dispatch(uploadFile(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(createInvestmentApplication({
            lotId: investmentNumber,
            farmerId: userInfo.accountsDto.accountNumber,
            proposalText,
            documentsUrl: documentsUrl || "",
            expectedProfit,
            applicationStatus: "PENDING"
        }));
        setProposalText("");
        setExpectedProfit("");
        setDocumentsUrl("");
        onClose();
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative">
                <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl" onClick={onClose}>&times;</button>
                <h2 className="text-xl font-bold mb-4">{t('investments.submitApplication')}</h2>
                <textarea
                    className="w-full border rounded p-2 mb-3"
                    placeholder={t('investments.proposalText')}
                    value={proposalText}
                    onChange={e => setProposalText(e.target.value)}
                    required
                />
                <input
                    className="w-full border rounded p-2 mb-3"
                    placeholder={t('investments.expectedProfit')}
                    value={expectedProfit}
                    onChange={e => setExpectedProfit(e.target.value)}
                    required
                />
                <FileUpload onFileSelect={handleFileUpload} />
                {upload.isLoading && <Typography>Загрузка файла...</Typography>}
                {upload.error && <Alert severity="error">{upload.error}</Alert>}
                {documentsUrl && (
                    <Alert severity="success">Файл загружен: <a href={documentsUrl} target="_blank" rel="noopener noreferrer">Скачать</a></Alert>
                )}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl">{t('investments.sendApplicationForLot')}</button>
            </form>
        </div>
    );
};