import React from 'react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();
    const investorSteps = t('howItWorks.investorSteps', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;
    const farmerSteps = t('howItWorks.farmerSteps', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;

    return (
        <section className="py-12 bg-gradient-to-r from-green-50 via-yellow-50 to-green-100 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold leading-tight text-green-900 sm:text-4xl lg:text-5xl">
                        {t('howItWorks.title')}
                    </h2>
                    <p className="max-w-xl mx-auto mt-4 text-lg leading-relaxed text-green-700">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Инвестор */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border-2 border-green-100">
                        <h3 className="text-2xl font-bold text-green-800 mb-6">{t('howItWorks.investorTitle')}</h3>
                        <ol className="space-y-8 w-full">
                            {investorSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold border-2 border-green-300">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-green-900">{idx + 1}. {step.title}</p>
                                        <p className="text-green-700">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    {/* Фермер */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border-2 border-yellow-100">
                        <h3 className="text-2xl font-bold text-yellow-800 mb-6">{t('howItWorks.farmerTitle')}</h3>
                        <ol className="space-y-8 w-full">
                            {farmerSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl font-bold border-2 border-yellow-300">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-yellow-900">{idx + 1}. {step.title}</p>
                                        <p className="text-yellow-700">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;