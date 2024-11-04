import React, { useEffect, useState } from 'react';
import { getAllCourses, deleteCourse } from '../services/courseService'; // Importing the service
import Button1 from '../../Shared/components/Button1';
import CourseList from '../components/CourseList'; // Importing the new CourseList component
import LoadingSpinner from '../../Shared/components/LoadingSpinner'; // Importing the loading spinner
import styles from './CourseListPage.module.css'; // Assuming we will create a CSS file for styles
import { useRouter } from 'next/router'; // Importing useRouter for navigation

const CourseListPage = ({ handleError }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Initialize router for navigation
    const COURSE_ENDPOINT = 'course';

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await getAllCourses(COURSE_ENDPOINT);
            if (Array.isArray(data)) {
                setCourses(data); // Set the courses state with the fetched data
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            handleError('Failed to fetch courses. Please try again later.'); // Set error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(); // Fetch courses on component mount
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteCourse(COURSE_ENDPOINT, id); // Call the deleteCourse function
            fetchCourses(); // Reload courses after deletion
        } catch (error) {
            console.error('Error deleting course:', error);
            handleError('Failed to delete course. Please try again later.'); // Set error message
        }
    };

    const handleEdit = (id) => {
        // Logic for editing a course
        console.log(`Edit course with id: ${id}`);
        router.push(`/course/${id}/edit`);
    };

    const handleCreate = () => {
        console.log('Create new course');
        router.push('/course/new'); // Redirect to the new course page using Next.js router
    };

    if (loading) {
        return (<div className={styles.loadingCoursesArea}>
                    <LoadingSpinner />
                </div>);
    }

    // if (error) { 
    //     return <div className={styles.errorMessage}>{error}</div>;
    // }

    return (
        <div className={styles.courseListPage}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1em' }}>
                <Button1 onClick={handleCreate}>Nuevo Curso +</Button1>
            </div>
            <CourseList courses={courses} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default CourseListPage;
