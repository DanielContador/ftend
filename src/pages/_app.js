import { AuthProvider } from '../provider/authProvider';
import Head from 'next/head';
import '../styles/globals.css'; // Ensure this path is correct and the file exists
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
import translationES from '../locales/es.json';
import translationEN from '../locales/en.json';

// i18n configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: translationES },
      en: { translation: translationEN },
    },
    lng: 'es', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <I18nextProvider i18n={i18n}>
                <Head>
                    <title>DL | Robot Curso</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <Component {...pageProps} />
            </I18nextProvider>
        </AuthProvider>
    );
};

export default MyApp;
