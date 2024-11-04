import { AuthProvider } from '../provider/authProvider';
import Head from 'next/head';
import '../styles/globals.css'; // Ensure this path is correct and the file exists

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            {/* <AuthMiddleware> */}
                <Head>
                    <title>DL | Robot Curso</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <Component {...pageProps} />
            {/* </AuthMiddleware> */}
        </AuthProvider>
    );
};

export default MyApp;