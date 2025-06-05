import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  const heroFeatures = t('hero.features', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;

  return (
    <div className="relative mt-6">
      <section className="relative bg-gradient-to-r">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-white"></div>
        </div>
        <div className="relative mx-auto w-full lg:grid lg:grid-cols-2">
          <div className="flex items-left bg-white pt-12 px-0 sm:px-2 pb-8 lg:pb-12">
            <div className="mx-auto lg:mx-0 text-center">
              <p className="text-4xl sm:text-5xl lg:text-6xl">📈</p>
              <h1 className="mt-6 text-3xl font-bold text-green-900 sm:text-4xl lg:text-5xl">
                {t('hero.title')}
              </h1>
              <p className="mt-4 text-2xl font-normal leading-7 text-green-700">
                {t('hero.subtitle')}
              </p>
              <div className="relative inline-flex mt-8 group">
                <div className="absolute transition-all duration-1000 opacity-70 inset-0 bg-gradient-to-r from-green-300 via-yellow-200 to-green-400 rounded-2xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                <a
                  href="/investments"
                  className="inline-flex relative items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-green-700 border border-transparent rounded-2xl hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                  role="button"
                >
                  {t('hero.cta')}
                </a>
              </div>
            </div>
          </div>
          <div className="relative flex items-right rounded-l-3xl py-8 bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 px-0 sm:px-2 lg:pb-12 lg:px-4 xl:pl-6 xs:mt-8">
            <div className="absolute inset-0 rounded-l-3xl">
              <img className="object-cover w-full h-full rounded-l-3xl" src="https://landingfoliocom.imgix.net/store/collection/clarity-blog/images/hero/6/grid-pattern.svg" alt="" />
            </div>
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
              <div className="mt-4 space-y-3 px-6">
                {heroFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="overflow-hidden transition-all duration-200 transform bg-white border border-green-200 rounded-2xl hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="px-3 py-3 sm:p-4 flex items-center gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <p className="text-base font-bold text-green-900">{f.title}</p>
                        <p className="text-sm text-green-700">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;