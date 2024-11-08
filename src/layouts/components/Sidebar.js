import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const Sidebar = ({ isOpen, toggleSidebar, items, activeItem }) => {
    const router = useRouter();
    const { t } = useTranslation(); // Using the translation hook

    const handleItemClick = (item) => {
        if (!item.blocked) {
            router.push(item.link);
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <nav className={styles.nav}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index} className={activeItem === item.page ? styles.active : ''}>
                            <a href='#'
                                className={item.blocked ? styles.blocked : ''}
                                onClick={() => handleItemClick(item)}
                            >
                                <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                                {isOpen && item.label} {/* Using translation key for label */}
                            </a>
                        </li>
                    ))}
                </ul>
                <button onClick={toggleSidebar} className={styles.toggleButton}>
                    <FontAwesomeIcon icon={isOpen ? faAngleLeft : faAngleRight} />
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;
