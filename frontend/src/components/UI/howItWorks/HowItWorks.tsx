import React from 'react';

const investorSteps = [
    { icon: "📝", title: "Создать аккаунт", desc: "Зарегистрируйтесь как инвестор на платформе AgriChain." },
    { icon: "📢", title: "Опубликовать лот", desc: "Создайте заявку, указав, во что готовы вложить средства." },
    { icon: "🏆", title: "Аукцион", desc: "Фермеры подают заявки, вы выбираете лучших кандидатов." },
    { icon: "🤝", title: "Договор", desc: "Заключите смарт-контракт с выбранным фермером." },
    { icon: "💸", title: "Получить дивиденды", desc: "Получайте доход от успешных проектов." },
];

const farmerSteps = [
    { icon: "📝", title: "Создать аккаунт", desc: "Зарегистрируйтесь как фермер на платформе AgriChain." },
    { icon: "🌱", title: "Подать заявку на лот", desc: "Выберите интересующий лот и предложите свою кандидатуру." },
    { icon: "📊", title: "Результаты", desc: "Узнайте итоги аукциона и получите обратную связь." },
    { icon: "🤝", title: "Договор", desc: "Заключите смарт-контракт с инвестором." },
    { icon: "🚜", title: "Получить инвестиции", desc: "Получите средства и развивайте своё предприятие." },
    { icon: "💵", title: "Выплатить дивиденды", desc: "Выплатите инвестору дивиденды по завершении проекта." },
];

const HowItWorks = () => (
    <section className="py-12 bg-gradient-to-r from-green-50 via-yellow-50 to-green-100 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold leading-tight text-green-900 sm:text-4xl lg:text-5xl">
                    Как работает AgriChain?
                </h2>
                <p className="max-w-xl mx-auto mt-4 text-lg leading-relaxed text-green-700">
                    Платформа объединяет инвесторов и фермеров для прозрачных и выгодных инвестиций в агросектор.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Инвестор */}
                <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border-2 border-green-100">
                    <h3 className="text-2xl font-bold text-green-800 mb-6">Путь инвестора</h3>
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
                    <h3 className="text-2xl font-bold text-yellow-800 mb-6">Путь фермера</h3>
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

export default HowItWorks;