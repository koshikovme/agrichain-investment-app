import React from "react";
import { InvestmentType, InvestmentLotStatus } from "../../features/investment/investmentTypes";
import { GiCow, GiWheat, GiFarmTractor, GiMoneyStack } from "react-icons/gi";
import { MdOutlineFilterAlt } from "react-icons/md";

export interface InvestmentFilters {
    type?: InvestmentType;
    status?: InvestmentLotStatus;
    minSum?: number;
    maxSum?: number;
    deadline?: string;
    search?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
    CATTLE: <GiCow className="text-green-700 text-lg sm:text-xl mr-1" />,
    LAND: <GiWheat className="text-amber-700 text-lg sm:text-xl mr-1" />,
    EQUIPMENT: <GiFarmTractor className="text-lime-700 text-lg sm:text-xl mr-1" />,
    CASH: <GiMoneyStack className="text-yellow-600 text-lg sm:text-xl mr-1" />,
};

export const InvestmentFiltersComponent = ({ filters, setFilters, onReset }: {
    filters: InvestmentFilters;
    setFilters: (f: InvestmentFilters) => void;
    onReset: () => void;
}) => (
    <div className="relative flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-stretch bg-gradient-to-r from-green-50 via-lime-50 to-amber-50 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-green-200 ring-1 ring-lime-100">
        <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-green-800 font-semibold text-xs sm:text-sm">Тип</label>
            <div className="flex items-center">
                {filters.type && typeIcons[filters.type]}
                <select
                    className="w-full sm:min-w-[150px] ml-0 sm:ml-2 rounded-xl bg-white border border-green-300 px-3 py-2 text-green-900 font-medium shadow focus:ring-2 focus:ring-green-400 transition text-xs sm:text-base"
                    value={filters.type || ""}
                    onChange={e => setFilters({ ...filters, type: e.target.value as InvestmentType })}
                >
                    <option value="">Все типы</option>
                    <option value="CATTLE">Скот</option>
                    <option value="LAND">Земля</option>
                    <option value="EQUIPMENT">Оборудование</option>
                    <option value="CASH">Деньги</option>
                </select>
            </div>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-green-800 font-semibold text-xs sm:text-sm">Статус</label>
            <select
                className="w-full sm:min-w-[170px] rounded-xl bg-white border border-green-300 px-3 py-2 text-green-900 font-medium shadow focus:ring-2 focus:ring-green-400 transition text-xs sm:text-base"
                value={filters.status || ""}
                onChange={e => setFilters({ ...filters, status: e.target.value as InvestmentLotStatus })}
            >
                <option value="">Все статусы</option>
                <option value="OPEN">🟢 Открыт</option>
                <option value="UNDER_REVIEW">🟡 На рассмотрении</option>
                <option value="CLOSED">🔴 Закрыт</option>
                <option value="REJECTED">⚪ Отклонён</option>
            </select>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-green-800 font-semibold text-xs sm:text-sm">Мин. сумма</label>
            <input
                type="number"
                placeholder="от"
                className="rounded-xl border border-green-300 px-3 py-2 w-full min-w-[90px] sm:min-w-[110px] bg-white text-green-900 font-medium shadow focus:ring-2 focus:ring-green-400 transition text-xs sm:text-base"
                value={filters.minSum || ""}
                onChange={e => setFilters({ ...filters, minSum: Number(e.target.value) })}
            />
        </div>
        <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-green-800 font-semibold text-xs sm:text-sm">Макс. сумма</label>
            <input
                type="number"
                placeholder="до"
                className="rounded-xl border border-green-300 px-3 py-2 w-full min-w-[90px] sm:min-w-[110px] bg-white text-green-900 font-medium shadow focus:ring-2 focus:ring-green-400 transition text-xs sm:text-base"
                value={filters.maxSum || ""}
                onChange={e => setFilters({ ...filters, maxSum: Number(e.target.value) })}
            />
        </div>
        <div className="flex flex-col flex-1 min-w-[120px] sm:min-w-[180px]">
            <label className="mb-1 text-green-800 font-semibold text-xs sm:text-sm">Поиск</label>
            <input
                type="text"
                placeholder="Описание, условия..."
                className="rounded-xl border border-green-300 px-3 py-2 w-full bg-white text-green-900 font-medium shadow focus:ring-2 focus:ring-green-400 transition text-xs sm:text-base"
                value={filters.search || ""}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
        </div>
        <button
            onClick={onReset}
            className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-100 to-lime-100 text-amber-800 font-bold px-4 sm:px-6 py-2 shadow hover:bg-amber-200 hover:text-green-800 transition text-xs sm:text-base mt-2 sm:mt-0"
        >
            Сбросить
        </button>
        <div className="hidden sm:block absolute right-4 top-2 opacity-20 pointer-events-none select-none text-6xl sm:text-7xl">
            <GiWheat />
        </div>
    </div>
);