import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './MainLayout.module.css'; // Assuming we will create a CSS file for styles

const MainLayout = ({ children }) => {
    return (
        <div className={styles.mainLayout}>
            <Header />
            <main className={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
