import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUserDetails } from "../features/user/userSlice";
import { fetchAllInvestments } from "../features/investment/investmentsSlice";
import { keycloak } from "../features/auth/keycloak";
import CreateInvestmentForm from "../components/CreateInvestmentForm";
import { InvestmentLotsDto } from "../features/investment/investmentTypes";
import { useTranslation } from "react-i18next";
import { useInvestmentsWebSocket } from "../features/investment/useInvestmentsWebSocket";
import { InvestmentFilters, InvestmentFiltersComponent } from "../components/InvestmentFilters";

const InvestmentCard = ({
                            inv,
                            onBid,
                            onDividends,
                            isFarmer,
                            isOwner
                        }: {
    inv: InvestmentLotsDto;
    onBid?: (id: number) => void;
    onDividends?: (id: number) => void;
    isFarmer: boolean;
    isOwner: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-200 flex flex-col p-6 min-w-[320px] max-w-[370px] mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-lg font-bold text-green-800">
                    {t('investments.cardTitle', { number: inv.investmentNumber })}
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
                    onClick={() => onBid && onBid(inv.investmentNumber)}
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
        </div>
    );
};

const InvestmentsPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { userInfo, isLoading, error } = useAppSelector((state) => state.reducer.user);
    const { investmentLots } = useAppSelector((state) => state.reducer.investment);

    const [openForm, setOpenForm] = useState(false);

    const isInvestor = userInfo.accountsDto?.accountType === "INVESTORS";
    const isFarmer = userInfo.accountsDto?.accountType === "FARMERS";
    const myAccount = userInfo.accountsDto?.accountNumber;

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

    let visibleInvestments = investmentLots;
    if (isFarmer && myAccount) {
        visibleInvestments = investmentLots.filter(
            (inv) => inv.investmentStatus === "OPEN" && inv.accountNumber !== myAccount
        );
    }

    const handleBid = (investmentNumber: number) => {
        alert(t('investments.applicationSent', { number: investmentNumber }));
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
                                onClick={() => setOpenForm(true)}
                            >
                                {t('investments.createLot')}
                            </button>
                        </div>
                        {openForm && (
                            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative">
                                    <button
                                        className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl"
                                        onClick={() => setOpenForm(false)}
                                    >
                                        &times;
                                    </button>
                                    <CreateInvestmentForm />
                                </div>
                            </div>
                        )}
                    </>
                )}
                {visibleInvestments.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-lg">
                        {t('investments.noLots')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-6">
                        {filteredInvestments.map((inv: InvestmentLotsDto) => (
                            <InvestmentCard
                                key={inv.investmentNumber}
                                inv={inv}
                                onBid={handleBid}
                                onDividends={handleDividends}
                                isFarmer={isFarmer}
                                isOwner={inv.accountNumber === myAccount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentsPage;