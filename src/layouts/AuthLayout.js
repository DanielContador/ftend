import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
    return (
        <div className={styles.authLayout}>
            <Header />
            <main className={styles.authMain}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default AuthLayout;
