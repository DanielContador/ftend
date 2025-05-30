import React from 'react';
import styles from './Button1.module.css';

const Button1 = ({ onClick, children, className = '' }) => {
    return (
        <button onClick={onClick} className={`${styles.button1} ${className}`}>
            {children}
        </button>
    );
};

export default Button1;
