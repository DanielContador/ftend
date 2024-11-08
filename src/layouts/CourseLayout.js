import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar'; // Importing the new Sidebar component
import BackButton from './components/BackButton'; // Importing the BackButton component
import styles from './CourseLayout.module.css'; // Assuming we will create a CSS file for styles
import { faCog, faSitemap, faBook, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const CourseLayout = ({ children, courseId, currentPage }) => { // Added currentPage as a parameter
    const { t } = useTranslation(); // Using the translation hook
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const savedSidebarState = localStorage.getItem('isSidebarOpen');
        if (savedSidebarState !== null) {
            setIsSidebarOpen(JSON.parse(savedSidebarState));
        }
        // Add a class to body to prevent transition effect initially
        document.body.classList.add('no-transition');
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);
    }, []);

    const toggleSidebar = () => {
        const newSidebarState = !isSidebarOpen;
        setIsSidebarOpen(newSidebarState);
        localStorage.setItem('isSidebarOpen', JSON.stringify(newSidebarState));
    };

    // Define sidebar items based on the current page
    const menuItems = courseId ? [
        { page: 'EditCoursePage', label: t('settings'), link: `/course/${courseId}/edit`, blocked: false, icon: faCog },
        { page: 'CourseStructurePage', label: t('structure'), link: `/course/${courseId}/edit/course-structure`, blocked: false, icon: faSitemap },
        { page: 'Content', label: t('content'), link: `/course/${courseId}/edit/content`, blocked: false, icon: faBook },
        { page: 'Quizzes', label: t('evaluation'), link: `/course/${courseId}/edit/quizzes`, blocked: false, icon: faQuestionCircle },
    ] : [
        { page: 'NewCoursePage', label: t('settings'), link: '/course/new', blocked: false, icon: faCog },
        { page: 'CourseStructurePage', label: t('structure'), link: '#', blocked: true, icon: faSitemap },
        { page: 'Content', label: t('content'), link: '#', blocked: true, icon: faBook },
        { page: 'Quizzes', label: t('evaluation'), link: '#', blocked: true, icon: faQuestionCircle },
    ];

    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.container}>
                <Sidebar 
                    items={menuItems} 
                    isOpen={isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                    activeItem={currentPage || menuItems[0].page} // Pass active item to Sidebar
                />
                <main className={styles.mainContent}>
                    <BackButton endpoint="/" /> {/* Adding the BackButton */}
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default CourseLayout;
