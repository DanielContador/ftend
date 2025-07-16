import React, { useState } from "react";
import styles from "./CourseListForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faHeadphones,
  faBookOpen,
  faEye,
  faTrash,
  faAngleDown,
  faAngleUp,
  faFilePowerpoint,
  faCopy,
  faPencil,
  faCoins,
  faLayerGroup,
  faPlus,
  faSearch, // <-- importar icono de lupa
} from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmationPopup from "../../../../shared/components/DeleteConfirmationPopup";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../shared/utils/authProvider";

const resourceData = [
  {
    key: "Audio",
    text: "Audio",
    icon: <FontAwesomeIcon icon={faHeadphones} />,
    style: styles.iconAudio,
  },
  {
    key: "Video",
    text: "Video",
    icon: <FontAwesomeIcon icon={faVideo} />,
    style: styles.iconVideo,
  },
  {
    key: "course",
    text: "Curso",
    icon: <FontAwesomeIcon icon={faBookOpen} />,
    style: styles.iconBook,
  },
  {
    key: "PPT",
    text: "Presentación PPT",
    icon: <FontAwesomeIcon icon={faFilePowerpoint} />,
    style: styles.iconPPT,
  },
  {
    key: "PDF",
    text: "PDF",
    icon: <FontAwesomeIcon icon={faFilePowerpoint} />,
    style: styles.iconPPT,
  },
  {
    key: "Word",
    text: "Word",
    icon: <FontAwesomeIcon icon={faFilePowerpoint} />,
    style: styles.iconPPT,
  },
  {
    key: "Txt",
    text: "Txt",
    icon: <FontAwesomeIcon icon={faFilePowerpoint} />,
    style: styles.iconPPT,
  },
];

const CourseListForm = ({
  data,
  handleCreate,
  handleEdit,
  handleDelete,
  handleClone,
  handleFilterData,
}) => {
  const { t } = useTranslation();
  const { endSession } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [courses, setCourses] = useState(data);
  console.log(data);
  const [order, setOrder] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const handleButtonOrder = () => {
    courses.sort((a, b) => {
      const dateA = new Date(a.timeCreated);
      const dateB = new Date(b.timeCreated);
      return order ? dateB - dateA : dateA - dateB;
    });
    setCourses([...courses]);
    setOrder(!order);
  };
  const handleButtonEdit = (id, type) => {
    handleEdit(id, type);
  };
  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setIsPopupOpen(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(courseToDelete);
    setIsPopupOpen(false);
    setCourseToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsPopupOpen(false);
    setCourseToDelete(null);
  };
  const handleOnKey = async (e) => {
    if (e.key === "Enter") {
      let result = await handleFilterData("?name=", filterValue);
      setCourses(result?.resources);
    }
  };
  const handleOnChangeInput = async (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Recursos Generados</h1>
          <button onClick={handleCreate} className={styles.createBtn}>
            <FontAwesomeIcon icon={faPlus} /> Crear recurso +
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchInputWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              onChange={handleOnChangeInput}
              value={filterValue}
              type="search"
              placeholder="Buscar recurso..."
              className={styles.searchInput}
              onKeyDown={handleOnKey}
            />
          </div>
          <button onClick={handleButtonOrder} className={styles.orderBtn}>
            Orden
            {order ? (
              <FontAwesomeIcon
                className={styles.iconAngle}
                icon={faAngleDown}
              />
            ) : (
              <FontAwesomeIcon className={styles.iconAngle} icon={faAngleUp} />
            )}
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.card}>
            <div className={`${styles.actionCard} ${styles.iconLayerGroup}`}>
              <FontAwesomeIcon icon={faLayerGroup} />
            </div>
            <div>
              <p className={styles.number}>{data.length}</p>
              <p className={styles.cardSubInfo}>Recursos creados</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.actionCard} ${styles.iconVideo}`}>
              <FontAwesomeIcon icon={faVideo} />
            </div>
            <div>
              <p className={styles.number}>Video</p>
              <p className={styles.cardSubInfo}>Mayor generado</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.actionCard} ${styles.iconCoins}`}>
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <div>
              <p className={styles.number}>55</p>
              <p className={styles.cardSubInfo}>Créditos restantes</p>
            </div>
          </div>
        </div>

        <div className={styles.resourcesWrapper}>
          <div className={styles.resources}>
            {courses.map((course) => (
              <div key={course.id} className={styles.resourceCard}>
                <div>
                  {course?.resource != null && (
                    <div className={styles.typeLabel}>
                      <div
                        className={`${styles.actionCard} ${
                          resourceData.find((f) => f.key === course.resource)
                            ?.style
                        }`}
                      >
                        {
                          resourceData.find((f) => f.key === course.resource)
                            ?.icon
                        }
                      </div>
                      {
                        resourceData.find((f) => f.key === course.resource)
                          ?.text
                      }
                    </div>
                  )}
                  <div className="mt-2">
                    <h3 className={styles.courseName}>{course.name}</h3>
                    <p className={styles.date}>
                      Creado en{" "}
                      {new Date(course.timeCreated).toLocaleDateString(
                        "es-ES",
                        {
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <div className={styles.actions}>
                    {course?.courseType && (
                      <div className={`${styles.wordCard} ${styles.tagVideo}`}>
                        <p className={styles.textType}>
                          {course.courseType == "SCORM"
                            ? resourceData.find(
                                (f) => f.key === course.resource
                              )?.text
                            : resourceData.find(
                                (f) => f.key === course.resource
                              )?.text}
                        </p>
                      </div>
                    )}
                    {course?.duplicate && (
                      <div
                        className={`${styles.wordCard} ${styles.tagDuplicado}`}
                      >
                        <p className={styles.textType}>Duplicado</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.actions}>
                    <div
                      onClick={() =>
                        handleButtonEdit(course.id, course.courseType)
                      }
                      className={styles.actionCard}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                    <div className={styles.actionCard}>
                      <FontAwesomeIcon icon={faEye} />
                    </div>
                    <div
                      onClick={() => handleDeleteClick(course.id)}
                      className={styles.actionCard}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </div>
                    <div
                      onClick={() => handleClone(course.id)}
                      className={styles.actionCard}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isPopupOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t("confirmDeletion")}
        message={t("confirmDeletionMessage")}
      />
    </>
  );
};

export default CourseListForm;
