import React, { useState } from 'react';
import styles from './CourseEvaluation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSave, faPlus, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

const initialQuestions = [
  {
    id: 1,
    text: 'What is the primary difference between supervised and unsupervised learning?',
    type: 'checkbox',
    points: 5,
    options: [
      { id: 1, text: 'Supervised learning requires labeled data for training', checked: true },
      { id: 2, text: 'There is no difference between them', checked: false },
    ],
  },
  {
    id: 2,
    text: 'Which of these is NOT a common application of deep learning?',
    type: 'radio',
    points: 5,
    options: [
      { id: 1, text: 'Image Recognition', checked: false },
      { id: 2, text: 'Making Coffee', checked: true },
    ],
  },
];

const CourseEvaluation = () => {
  const [questions, setQuestions] = useState(initialQuestions);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Module 3: Advanced Machine Learning</h2>
            <p className={styles.subtitle}>Add questions to assess student understanding of this module</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.previewBtn}><FontAwesomeIcon icon={faEye} /> Preview</button>
            <button className={styles.saveBtn}><FontAwesomeIcon icon={faSave} /> Save</button>
          </div>
        </div>

        {questions.map((q) => (
          <div key={q.id} className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <p className={styles.questionText}>{q.text}</p>
              <input type="text" className={styles.pointsInput} defaultValue={`${q.points} pts`} />
            </div>
            <div className={styles.optionsContainer}>
              {q.options.map((opt, index) => (
                <div key={opt.id} className={styles.option}>
                  <input type={q.type} name={`question-${q.id}`} defaultChecked={opt.checked} />
                  <input type="text" defaultValue={opt.text} />
                </div>
              ))}
            </div>
            <a className={styles.addOptionLink}><FontAwesomeIcon icon={faPlus} /> Add option</a>
          </div>
        ))}
      </div>

      <div className={styles.sidebar}>
        <button className={styles.addQuestionBtn}><FontAwesomeIcon icon={faPlus} /> Agregar pregunta</button>
        <button className={styles.generateAIBtn}><FontAwesomeIcon icon={faWandMagicSparkles} /> Generar con IA</button>

        <div className={styles.configBox}>
          <h3 className={styles.configTitle}>Configuración</h3>
          <div className={styles.configItem}>
            <div className={styles.configCheckbox}>
              <input type="checkbox" id="random-questions" />
              <label htmlFor="random-questions">Preguntas aleatorias</label>
            </div>
          </div>
          <div className={styles.configItem}>
            <label htmlFor="time-limit">Tiempo estimado</label>
            <input type="text" id="time-limit" defaultValue="15 minutos" />
          </div>
          <div className={styles.configItem}>
            <label htmlFor="min-score">Puntaje mínimo</label>
            <input type="text" id="min-score" defaultValue="70%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEvaluation;
