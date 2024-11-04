import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar'; // Importing the new Sidebar component
import BackButton from './components/BackButton'; // Importing the BackButton component
import styles from './CourseLayout.module.css'; // Assuming we will create a CSS file for styles

const CourseLayout = ({ children, courseId, currentPage }) => { // Added currentPage as a parameter
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Define sidebar items based on the current page
    const menuItems = courseId ? [
        { page: 'EditCoursePage', label: 'Configuración', link: `/course/${courseId}/edit`, blocked: false },
        { page: 'CourseStructurePage', label: 'Estructura', link: `/course/${courseId}/edit/course-structure`, blocked: false },
        { page: 'Content', label: 'Contenido', link: `/course/${courseId}/edit/content`, blocked: false },
        { page: 'Quizzes', label: 'Evaluación', link: `/course/${courseId}/edit/quizzes`, blocked: false },
    ] : [
        { page: 'NewCoursePage', label: 'Configuración', link: '/course/new', blocked: false },
        { page: 'CourseStructurePage', label: 'Estructura', link: '#', blocked: true },
        { page: 'Content', label: 'Contenido', link: '#', blocked: true },
        { page: 'Quizzes', label: 'Evaluación', link: '#', blocked: true },
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
