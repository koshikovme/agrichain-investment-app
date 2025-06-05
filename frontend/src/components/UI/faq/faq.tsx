import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqData = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>;

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-gradient-to-r from-green-50 via-yellow-50 to-green-100 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-4xl">
                <div className="max-w-2xl mx-auto text-centeрека дракаr mb-10">
                    <h2 className="text-3xl font-bold leading-tight text-green-900 sm:text-4xl lg:text-5xl font-pj">
                        {t('faq.title')}
                    </h2>
                    <p className="max-w-xl mx-auto mt-4 text-lg leading-relaxed text-green-700">
                        {t('faq.subtitle')}
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-12">
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className={`transition-all duration-300 bg-white border-2 border-green-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg ${isOpen ? 'ring-2 ring-green-300' : ''}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    className="flex items-center justify-between w-full px-6 py-5 focus:outline-none"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-content-${index}`}
                                >
                                    <span className="flex text-lg font-semibold text-green-900 font-pj">{item.question}</span>
                                    <svg
                                        className={`w-6 h-6 text-green-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div
                                    id={`faq-content-${index}`}
                                    className={`px-6 overflow-hidden transition-all duration-500 transform-gpu ${
                                        isOpen
                                            ? 'opacity-100 max-h-[500px] translate-y-0 py-4'
                                            : 'opacity-0 max-h-0 -translate-y-2 py-0'
                                    }`}
                                    style={{ transitionProperty: 'opacity, transform, max-height, padding' }}
                                >
                                    <p
                                        className="text-green-800 text-base font-pj"
                                        dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                </div>

                            </div>
                        );
                    })}

                </div>
                <p className="text-center text-green-700 text-base mt-10">
                    {t('faq.notFound')}{' '}
                    <a href="mailto:support@agrichain.kz" className="font-semibold underline hover:text-green-900 transition">
                        {t('faq.contactSupport')}
                    </a>
                </p>
            </div>
        </section>
    );
};

export default FAQ;