import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';
import { useRouter } from 'next/router';

const Sidebar = ({ isOpen, toggleSidebar, items, activeItem }) => {
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const sidebar = document.querySelector(`.${styles.nav}`);
            const toggleButton = document.querySelector(`.${styles.toggleButton}`);
            if (window.scrollY > 0) {
                if (sidebar) {
                    sidebar.style.position = 'relative';
                    sidebar.style.top = `${window.scrollY}px`;
                }
                if (toggleButton) {
                    toggleButton.style.position = 'absolute';
                    toggleButton.style.top = `${window.scrollY}px`; // Adjust toggle button position
                }
            } else {
                if (sidebar) {
                    sidebar.style.position = 'relative';
                }
                if (toggleButton) {
                    toggleButton.style.position = 'absolute';
                    toggleButton.style.top = '30vh'; // Reset toggle button position
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleItemClick = (item) => {
        if (!item.blocked) {
            router.push(item.link);
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            {isOpen && (
                <nav className={styles.nav}>
                    <ul>
                        {items.map((item, index) => (
                            <li key={index} className={activeItem === item.page ? styles.active : ''}>
                                <a href='#'
                                    className={item.blocked ? styles.blocked : ''} 
                                    onClick={() => handleItemClick(item)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
            <button onClick={toggleSidebar} className={styles.toggleButton}>
                <FontAwesomeIcon icon={isOpen ? faAngleLeft : faAngleRight} />
            </button>
        </aside>
    );
};

export default Sidebar;
