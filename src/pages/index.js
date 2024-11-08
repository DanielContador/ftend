import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../provider/authProvider';
import MainLayout from '../layouts/MainLayout';
import CourseListPage from '../modules/Course/containers/CourseListPage';
import ErrorMessage from '../layouts/components/ErrorMessage';
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const HomePage = () => {
    const { t } = useTranslation(); // Using the translation hook
    const router = useRouter();
    const { isLoggedIn, isLoading } = useAuth();
    const [error, setError] = useState(null); // State to hold error messages

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) {
        return <div>{t('loading')}</div>; // Using translation key for loading message
    }

    const handleError = (errorMessage) => {
        setError(errorMessage);
    };

    return (
        <MainLayout>
            {error && <ErrorMessage error={error} />} {/* Display error message if exists */}
            <CourseListPage handleError={handleError}/>
        </MainLayout>
    );
};

export default HomePage;
