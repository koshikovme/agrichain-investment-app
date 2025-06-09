import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUserDetails } from "../features/user/userSlice";
import {fetchAllInvestments, fetchInvestmentLotApplications} from "../features/investment/investmentsSlice";
import { keycloak } from "../features/auth/keycloak";
import CreateInvestmentForm from "../components/investments/CreateInvestmentForm";
import {InvestmentApplicationDto, InvestmentLotsDto } from "../features/investment/investmentTypes";
import { useTranslation } from "react-i18next";
import { useInvestmentsWebSocket } from "../features/investment/useInvestmentsWebSocket";
import { InvestmentFilters, InvestmentFiltersComponent } from "../components/investments/InvestmentFilters";
import { ApplyInvestmentModal } from "../components/investments/ApplyInvestmentModal";
import InvestmentApplicationsModal from "../components/investments/InvestmentApplicationsModal";
import {Box, Modal} from "@mui/material";

const InvestmentCard = ({
    inv,
    onApplication,
    onDividends,
    isFarmer,
    isOwner,
    isInvestor,
    onShowApplications
}: {
    inv: InvestmentLotsDto;
    onApplication?: (id: number) => void;
    onDividends?: (id: number) => void;
    isFarmer: boolean;
    isOwner: boolean;
    isInvestor: boolean;
    onShowApplications?: (id: number) => void;
}) => {
    const { t } = useTranslation();
    console.log("inv.investmentNumber: ", inv.accountNumber);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-200 flex flex-col p-6 min-w-[320px] max-w-[370px] mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-lg font-bold text-green-800">
                    {t('investments.cardTitle', { number: inv.investmentNumber })}
                    {inv.investmentNumber}
                </span>
            </div>
            <div className="text-sm text-green-700 mb-1">
                <span className="font-semibold">{t('investments.status')}:</span> {inv.investmentStatus}
            </div>
            <div className="text-sm text-green-700 mb-1">
                <span className="font-semibold">{t('investments.type')}:</span> {inv.investmentType}
            </div>
            <div className="text-base font-semibold text-amber-700 mb-2">
                {t('investments.amount')}: <span className="font-bold">{inv.sum} USD</span>
            </div>
            <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">{t('investments.description')}:</span> {inv.description}
            </div>
            <div className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">{t('investments.returnConditions')}:</span> {inv.returnConditions}
            </div>
            <div className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">{t('investments.requirements')}:</span> {inv.requirements}
            </div>
            {isFarmer && !isOwner && inv.investmentStatus === "OPEN" && (
                <button
                    className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl transition"
                    onClick={() => onApplication && onApplication(inv.investmentNumber)}
                >
                    {t('investments.submitApplication')}
                </button>
            )}
            {isFarmer && isOwner && (
                <button
                    className="w-full mt-2 border border-amber-400 text-amber-700 font-semibold py-2 rounded-xl hover:bg-amber-50 transition"
                    onClick={() => onDividends && onDividends(inv.investmentNumber)}
                >
                    {t('investments.payDividends')}
                </button>
            )}
            {isInvestor && isOwner && (
                <button
                    className="w-full mt-2 border border-blue-400 text-green-700 font-semibold py-2 rounded-xl hover:bg-green-800 transition"
                    onClick={() => onShowApplications && onShowApplications(inv.investmentNumber)}
                >
                    {t('investments.viewApplications')}
                </button>
            )}
        </div>
    );
};

const InvestmentsPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { userInfo, isLoading, error } = useAppSelector((state) => state.reducer.user);
    const { investmentLots } = useAppSelector((state) => state.reducer.investment);

    const [openInvestmentLotForm, setOpenInvestmentLotForm] = useState(false);
    const [openApplyForInvestmentLotForm, setOpenApplyForInvestmentLotForm] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null);

    const isInvestor = userInfo.accountsDto?.accountType === "INVESTORS";
    const isFarmer = userInfo.accountsDto?.accountType === "FARMERS";
    const myAccount = userInfo.accountsDto?.accountNumber;

    const [openApplicationsModal, setOpenApplicationsModal] = useState(false);
    const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
    const [applications, setApplications] = useState<InvestmentApplicationDto[]>([]);

    useInvestmentsWebSocket();

    const [filters, setFilters] = useState<InvestmentFilters>({});
    const [filteredInvestments, setFilteredInvestments] = useState<InvestmentLotsDto[]>([]);

    useEffect(() => {
        let result = investmentLots;
        if (filters.type) result = result.filter(i => i.investmentType === filters.type);
        if (filters.status) result = result.filter(i => i.investmentStatus === filters.status);
        if (filters.minSum) result = result.filter(i => i.sum >= filters.minSum!);
        if (filters.maxSum) result = result.filter(i => i.sum <= filters.maxSum!);
        if (filters.search) result = result.filter(i =>
            i.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
        setFilteredInvestments(result);
    }, [investmentLots, filters]);

    useEffect(() => {
        const mobileNumber = keycloak.tokenParsed?.mobile_number;
        if (mobileNumber) dispatch(fetchUserDetails(mobileNumber));
    }, [dispatch]);

    useEffect(() => {
        if ((isInvestor && myAccount) || isFarmer) {
            dispatch(fetchAllInvestments());
        }
    }, [dispatch, isInvestor, isFarmer, myAccount, keycloak]);

    const handleApplication = (investmentNumber: number) => {
        setSelectedInvestment(investmentNumber);
        setOpenApplyForInvestmentLotForm(true);
    };

    const handleOpenApplications = async (lotId: number) => {
        setSelectedLotId(lotId);
        setOpenApplicationsModal(true);
        const result = await dispatch(fetchInvestmentLotApplications(lotId)).unwrap();
        setApplications(result);
    };

    const handleDividends = (investmentNumber: number) => {
        alert(t('investments.dividendsInitiated', { number: investmentNumber }));
    };

    if (isLoading) return <div className="text-center text-green-700 text-lg">{t('common.loading')}</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-amber-50 py-8 px-2">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 text-center mb-6 drop-shadow-sm">
                    {isInvestor ? t('investments.myInvestmentLots') : t('investments.availableLotsForApplication')}
                </h1>
                <InvestmentFiltersComponent filters={filters} setFilters={setFilters} onReset={() => setFilters({})} />
                {isInvestor && (
                    <>
                        <div className="flex justify-center mb-6">
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition text-lg"
                                onClick={() => setOpenInvestmentLotForm(true)}
                            >
                                {t('investments.createLot')}
                            </button>
                        </div>
                        <Modal
                            open={openInvestmentLotForm}
                            onClose={() => setOpenInvestmentLotForm(false)}
                            aria-labelledby="create-investment-modal"
                            disableScrollLock // добавьте это свойство
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    outline: 'none',
                                    maxWidth: 600,
                                    width: '100%',
                                    maxHeight: '90vh',
                                    borderRadius: 3,
                                    p: 4,
                                    overflowY: 'auto', // добавьте это свойство
                                }}
                            >
                                <CreateInvestmentForm onClose={() => setOpenInvestmentLotForm(false)} />
                            </Box>
                        </Modal>

                    </>
                )}
                {filteredInvestments.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-lg">
                        {t('investments.noLots')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-6">
                        {filteredInvestments.map((inv: InvestmentLotsDto) => (
                            <InvestmentCard
                                key={inv.investmentNumber}
                                inv={inv}
                                onApplication={handleApplication}
                                onDividends={handleDividends}
                                isFarmer={isFarmer}
                                isOwner={inv.accountNumber === myAccount}
                                isInvestor={isInvestor}
                                onShowApplications={handleOpenApplications}
                            />
                        ))}
                    </div>
                )}
                <InvestmentApplicationsModal
                    open={openApplicationsModal}
                    onClose={() => setOpenApplicationsModal(false)}
                    applications={applications}
                    selectedLotId={selectedLotId}
                />
                {/* Модальное окно подачи заявки */}
                <ApplyInvestmentModal
                    open={openApplyForInvestmentLotForm}
                    onClose={() => setOpenApplyForInvestmentLotForm(false)}
                    investmentNumber={selectedInvestment!}
                />
            </div>
        </div>
    );
};

export default InvestmentsPage;