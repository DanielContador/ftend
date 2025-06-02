import Link from 'next/link';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className={styles.header}>
        <div className={styles.logo}>
          <FontAwesomeIcon icon={faInfinity} className='me-2' />
          MentorIA
        </div>
      </header>
  );
};

export default Header;
