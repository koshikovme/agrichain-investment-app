import React from 'react';
import { useTranslation } from 'react-i18next';

const StarIcons = ({ count }: { count: number }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <svg
                key={i}
                className="w-5 h-5 text-[#FBC02D]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </>
);

const Reviews = () => {
    const { t } = useTranslation();
    const reviews = t('reviews.items', { returnObjects: true }) as Array<{
        name: string;
        role: string;
        avatar: string;
        text: string;
        stars: number;
    }>;

    return (
        <section className="py-12 bg-gradient-to-r from-green-50 via-yellow-50 to-green-100 sm:py-16 lg:py-20 mt-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <div className="text-center">
                        <p className="text-lg font-medium text-green-700 font-pj">
                            {t('reviews.subtitle')}
                        </p>
                        <h2 className="mt-4 text-3xl font-bold text-green-900 sm:text-4xl xl:text-5xl font-pj">
                            {t('reviews.title')}
                        </h2>
                    </div>

                    <div className="relative mt-10 md:mt-24 md:order-2">
                        <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
                            <div
                                className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-20 blur-lg filter"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #e8f5e9 0%, #fffde7 100%)",
                                }}
                            ></div>
                        </div>

                        <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-3">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="flex flex-col overflow-hidden shadow-xl rounded-3xl border border-green-100 bg-white">
                                    <div className="flex flex-col justify-between flex-1 p-6 lg:py-8 lg:px-7">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <StarIcons count={review.stars} />
                                            </div>
                                            <blockquote className="flex-1 mt-8">
                                                <p className="text-lg leading-relaxed text-green-900 font-pj">
                                                    {review.text}
                                                </p>
                                            </blockquote>
                                        </div>
                                        <div className="flex items-center mt-8">
                                            <img
                                                className="flex-shrink-0 object-cover rounded-full w-14 h-14 border-2 border-green-200"
                                                src={review.avatar}
                                                alt={review.name}
                                            />
                                            <div className="ml-4">
                                                <p className="text-base font-bold text-green-900 font-pj">
                                                    {review.name}
                                                </p>
                                                <p className="mt-0.5 text-sm font-pj text-green-700">
                                                    {review.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reviews;