import React, { useState } from 'react';

const faqData = [
    {
        question: 'Как происходит оплата?',
        answer: '\b>AgriChain</b> поддерживает оплату через <b>PayPal</b> и <b>Solana Pay</b>. Выберите удобный способ при инвестировании в проекты.',
    },
    {
        question: 'Как инвестировать в агропроекты?',
        answer: 'Перейдите в раздел <b>Инвестиции</b>, выберите интересующий лот и нажмите <b>Инвестировать</b>. Выберите способ оплаты: PayPal или Solana Pay.',
    },
    {
        question: 'Как фермеру разместить инвестиционный лот?',
        answer: 'После регистрации как фермер заполните форму <b>Создать инвестиционный лот</b> на странице инвестиций. Укажите сумму, тип и описание проекта.',
    },
    {
        question: 'Безопасны ли мои средства?',
        answer: 'Все транзакции проходят через блокчейн и защищены современными технологиями. Информация о ваших инвестициях всегда доступна в личном кабинете.',
    },
    {
        question: 'Как связаться с поддержкой?',
        answer: 'Вы можете написать нам на <a href="mailto:support@agrichain.kz" class="text-green-700 underline font-semibold">support@agrichain.kz</a> или в <a href="https://t.me/agrichain_support" target="_blank" class="text-green-700 underline font-semibold">Telegram</a>.',
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-gradient-to-r from-green-50 via-yellow-50 to-green-100 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-4xl">
                <div className="max-w-2xl mx-auto text-center mb-10">
                    <h2 className="text-3xl font-bold leading-tight text-green-900 sm:text-4xl lg:text-5xl font-pj">
                        Часто задаваемые вопросы
                    </h2>
                    <p className="max-w-xl mx-auto mt-4 text-lg leading-relaxed text-green-700">
                        Всё, что вы хотели узнать о платформе AgriChain
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
                    Не нашли ответа? <a href="mailto:support@agrichain.kz" className="font-semibold underline hover:text-green-900 transition">Свяжитесь с поддержкой</a>
                </p>
            </div>
        </section>
    );
};

export default FAQ;