import React, { useState } from 'react';
import styles from './CourseForm.module.css'; // Assuming we will create a CSS file for styles
import stylesButton1 from '../../Shared/components/Button1.module.css'; // Importing Button1
import LoadingSpinner from '../../Shared/components/LoadingSpinner'; // Importing LoadingSpinner

// Constants for resource types and evaluation methods
const RESOURCE_TYPES = [
    { value: 'html5', label: 'HTML5 (diapositivas interactivas)' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'text', label: 'Archivos de texto (Word, Excel, txt y PDF)' },
    { value: 'ppt', label: 'PPT' },
    { value: 'url', label: 'URL' },
];

const EVALUATION_METHODS = [
    { value: 'diagnostic', label: 'Evaluación de diagnóstico' },
    { value: 'module', label: 'Evaluaciones por módulo' },
    { value: 'final', label: 'Evaluación final' },
];

const CourseForm = ({ onSubmit }) => {
    const [courseName, setCourseName] = useState('');
    const [contentSource, setContentSource] = useState('auto-generated');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [participantProfile, setParticipantProfile] = useState('');
    const [courseObjective, setCourseObjective] = useState('');
    const [resourceTypes, setResourceTypes] = useState([]);
    const [addActivities, setAddActivities] = useState(false);
    const [evaluationMethods, setEvaluationMethods] = useState([]);
    const [feedback, setFeedback] = useState(false);
    const [toneStyle, setToneStyle] = useState('');
    const [additionalContext, setAdditionalContext] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        window.scrollTo(0, 0); // Scroll to the top of the page
        setLoading(true); // Set loading to true
        
        // Convert list-type fields to comma-separated strings with labels
        const formattedResourceTypes = resourceTypes.map(type => 
            RESOURCE_TYPES.find(option => option.value === type)?.label
        ).join(', ');

        const formattedEvaluationMethods = evaluationMethods.map(method => 
            EVALUATION_METHODS.find(option => option.value === method)?.label
        ).join(', ');

        await onSubmit({
            courseName,
            contentSource,
            estimatedTime,
            participantProfile,
            courseObjective,
            resourceTypes: formattedResourceTypes, // Use formatted string
            addActivities,
            evaluationMethods: formattedEvaluationMethods, // Use formatted string
            feedback,
            toneStyle,
            additionalContext,
        });

        setLoading(false); // Set loading to false after submission
    };

    return (
        <>
            {loading ? <LoadingSpinner /> : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.formTitle}>Crear Curso</h1>
                    <div className={styles.fieldContainer}>
                        <label>Tema del curso: <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className={styles.inputField} // Applying the inputField class
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="Introduce el tema del curso"
                            required
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Fuente del contenido:</label>
                        <select 
                            className={styles.selectField} // Applying the selectField class
                            value={contentSource} 
                            onChange={(e) => setContentSource(e.target.value)}
                        >
                            <option value="auto-generated">Generado automáticamente por IA</option>
                            <option value="specific-source">Basado en una fuente específica</option>
                        </select>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Tiempo estimado de dedicación: <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number" // Changed to number type
                            className={styles.inputField} // Applying the inputField class
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                            placeholder="Ingresa el número de horas"
                            required
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Perfil del participante: <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className={styles.inputField} // Applying the inputField class
                            value={participantProfile}
                            onChange={(e) => setParticipantProfile(e.target.value)}
                            placeholder="Describe el perfil de los participantes"
                            required
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Objetivo general del curso: <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            className={styles.inputField} // Applying the inputField class
                            value={courseObjective}
                            onChange={(e) => setCourseObjective(e.target.value)}
                            placeholder="Describe el objetivo general del curso"
                            required
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>Tipos de recursos:</label>
                        <select 
                            multiple 
                            className={styles.selectField} // Applying the selectField class
                            value={resourceTypes} 
                            onChange={(e) => setResourceTypes([...e.target.selectedOptions].map(option => option.value))}
                        >
                            {RESOURCE_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>¿Desea agregar evaluación?</label>
                        <input
                            type="checkbox"
                            checked={addActivities}
                            onChange={(e) => setAddActivities(e.target.checked)}
                        />
                    </div>
                    {addActivities && (
                        <>
                            <div className={styles.fieldContainer}>
                                <label>Métodos de evaluación:</label>
                                <select 
                                    multiple 
                                    className={styles.selectField} // Applying the selectField class
                                    value={evaluationMethods} 
                                    onChange={(e) => setEvaluationMethods([...e.target.selectedOptions].map(option => option.value))}
                                >
                                    {EVALUATION_METHODS.map((method) => (
                                        <option key={method.value} value={method.value}>{method.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.fieldContainer}>
                                <label>¿Desea agregar retroalimentación a las preguntas de las evaluaciones?</label>
                                <input
                                    type="checkbox"
                                    checked={feedback}
                                    onChange={(e) => setFeedback(e.target.checked)}
                                />
                            </div>
                        </>
                    )}
                    <div className={styles.fieldContainer}>
                        <label>Tono y estilo del curso:</label>
                        <input
                            type="text"
                            className={styles.inputField} // Applying the inputField class
                            value={toneStyle}
                            onChange={(e) => setToneStyle(e.target.value)}
                            placeholder="Ejemplo: formal, cercano, técnico"
                        />
                    </div>
                    <div className={styles.fieldContainer}>
                        <label>¿Desea agregar más contexto?</label>
                        <textarea
                            className={styles.textareaField} // Applying the textareaField class
                            value={additionalContext}
                            onChange={(e) => setAdditionalContext(e.target.value)}
                            placeholder="Agrega más contexto aquí"
                        />
                    </div>
                    <button type="submit" className={stylesButton1.button1}>Generar Curso</button>
                </form>
            )}
        </>
    );
};

export default CourseForm;
