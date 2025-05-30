import React from 'react';
import styles from './Button2.module.css';

const Button2 = ({ onClick, children, className = '' }) => {
    return (
        <button onClick={onClick} className={`${styles.button2} ${className}`}>
            {children}
        </button>
    );
};

export default Button2;
