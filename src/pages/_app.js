import { AuthProvider } from "../shared/utils/authProvider";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import "../shared/styles/globals.css"; // Ensure this path is correct and the file exists
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import store from "../shared/store/store";
import FloatingError from "../shared/components/FloatingError";
import FloatingSuccess from "../shared/components/FloatingSuccess";
import { useSelector, useDispatch } from "react-redux";
import {
  hideFloatingError,
  hideFloatingSuccess,
} from "../shared/store/rootActions";

// Translation resources
import translationES from "../shared/locales/es.json";
import translationEN from "../shared/locales/en.json";

// i18n configuration
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: translationES },
    en: { translation: translationEN },
  },
  lng: "es", // default language
  fallbackLng: "en", // fallback language
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

function MyApp({ Component, pageProps }) {
  // Hook solo puede usarse dentro de un componente, así que lo movemos a un wrapper
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <Head>
            <title>DL | Robot Curso</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <FloatingErrorWrapper />
          <FloatingSuccessWrapper />
          <Component {...pageProps} />
        </Provider>
      </I18nextProvider>
    </AuthProvider>
  );
}

// Wrapper para usar hooks de redux
function FloatingErrorWrapper() {
  const dispatch = useDispatch();
  const { show, message } = useSelector((state) => state.floatingError);
  return (
    <FloatingError
      message={message}
      show={show}
      onClose={() => dispatch(hideFloatingError())}
    />
  );
}

function FloatingSuccessWrapper() {
  const dispatch = useDispatch();
  const { show, message } = useSelector((state) => state.floatingSuccess);
  return (
    <FloatingSuccess
      message={message}
      show={show}
      onClose={() => dispatch(hideFloatingSuccess())}
    />
  );
}

export default MyApp;
