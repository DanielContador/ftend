import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CourseExportManager.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faGraduationCap,
  faDesktop,
  faFileZipper,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import fileDownloadService from "../services/fileDownloadService";

const CourseExportManager = ({
  courseId,
  activityId,
  fileType,
  courseName,
}) => {
  const { t } = useTranslation();
  console.log(fileType);
  // Set default format based on fileType
  const defaultFormat = fileType === "scorm" ? "scorm" : "moodle";
  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);
  const [archiveName, setArchiveName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // All available export formats
  const allExportFormats = [
    {
      id: "moodle",
      title: "Moodle (.mbz)",
      description:
        "Archivo de respaldo nativo de Moodle, listo para importación directa.",
      icon: faGraduationCap,
    },
    {
      id: "scorm",
      title: "SCORM (.zip)",
      description: "Paquete compatible con SCORM 1.2/2004 para cualquier LMS.",
      icon: faDesktop,
    },
    {
      id: "independent",
      title: "Independent ZIP",
      description: "ZIP personalizado con recursos individuales.",
      icon: faFileZipper,
    },
  ];

  // Filter formats based on fileType
  const exportFormats =
    fileType === "scorm"
      ? allExportFormats.filter((format) => format.id === "scorm")
      : allExportFormats.filter((format) => format.id !== "scorm");

  const includedElements = [
    "Course Structure (.json)",
    "Learning Content",
    "Evaluations / Quizzes",
    "Audio Narration",
    "Avatars",
  ];

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      let response;
      let filename;
      let mimeType;

      // Helper function to generate filename with proper extension
      const generateFilename = (userInput, defaultName, extension) => {
        if (userInput && userInput.trim()) {
          const cleanInput = userInput.trim();
          // Check if user already included the extension
          if (cleanInput.toLowerCase().endsWith(extension.toLowerCase())) {
            return cleanInput;
          }
          // Add extension if not present
          return `${cleanInput}${extension}`;
        }
        return defaultName;
      };

      switch (selectedFormat) {
        case "moodle":
          response = await fileDownloadService.downloadCourseMBZ(courseId);
          filename = generateFilename(
            archiveName,
            `${courseName || "course"}_moodle.mbz`,
            ".mbz"
          );
          mimeType = "application/zip";
          break;
        case "independent":
          response = await fileDownloadService.downloadCourseZip(courseId);
          filename = generateFilename(
            archiveName,
            `${courseName || "course"}_independent.zip`,
            ".zip"
          );
          mimeType = "application/zip";
          break;
        case "scorm":
          response = await fileDownloadService.downloadCourseScorm(courseId);
          filename = generateFilename(
            archiveName,
            `${courseName || "activity"}_scorm.zip`,
            ".zip"
          );
          mimeType = "application/zip";
          break;
        default:
          throw new Error("Invalid export format selected");
      }

      // Create blob from response data and trigger download
      if (response) {
        const blob = new Blob([response], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("Export completed successfully:", {
          format: selectedFormat,
          courseId,
          activityId,
          fileType,
          filename,
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      // TODO: Show error message to user
      alert("Error al exportar el curso. Por favor, inténtelo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Previewing export for:", {
      courseId,
      format: selectedFormat,
      activityId,
      fileType,
    });
  };

  return (
    <div className={styles.exportManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Exportar tu curso</h2>
        <p className={styles.subtitle}>
          Descargue su paquete de curso completo, incluyendo contenido,
          estructura y evaluaciones.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Formato de exportación elegido
          </h3>
          <div className={styles.formatGrid}>
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className={`${styles.formatCard} ${
                  selectedFormat === format.id ? styles.formatCardSelected : ""
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div className={styles.formatIcon}>
                  <FontAwesomeIcon icon={format.icon} />
                </div>
                <div className={styles.formatContent}>
                  <h4 className={styles.formatTitle}>{format.title}</h4>
                  <p className={styles.formatDescription}>
                    {format.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Elementos incluidos</h3>
          <div className={styles.elementsGrid}>
            {includedElements.map((element, index) => (
              <div key={index} className={styles.elementItem}>
                {element}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Detalles del archivo</h3>
          <div className={styles.archiveDetails}>
            <label className={styles.inputLabel}>Nombre del archivo</label>
            <input
              type="text"
              className={styles.archiveInput}
              placeholder="Ingrese el nombre del archivo"
              value={archiveName}
              onChange={(e) => setArchiveName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button style={{ visibility: "hidden" }}>
          <FontAwesomeIcon icon={faEye} />
          Preview antes de exportar
        </button>
        <button
          className={`${styles.exportBtn} ${
            isExporting ? styles.exportBtnLoading : ""
          }`}
          onClick={handleExport}
          disabled={isExporting}
        >
          <FontAwesomeIcon
            icon={isExporting ? faSpinner : faDownload}
            className={isExporting ? styles.spinnerIcon : ""}
          />
          {isExporting ? "Exportando..." : "Exportar curso"}
        </button>
      </div>
    </div>
  );
};

export default CourseExportManager;
