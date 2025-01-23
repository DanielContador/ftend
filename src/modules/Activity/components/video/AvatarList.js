import React, { useState, useEffect, useRef } from 'react';
import styles from './AvatarList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

const AvatarList = ({ avatars, onAvatarSelect }) => {
    const [avatarToShow, setAvatarToShow] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [showVariantVideo, setShowVariantVideo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const avatarListRef = useRef(null);
    const [avatarClasses, setAvatarClasses] = useState([]);

    useEffect(() => {
        const updateAvatarClasses = () => {
            if (avatarListRef.current) {
                const avatarItems = avatarListRef.current.children;
                const newAvatarClasses = Array.from(avatarItems).map((item, index) => {
                    const rowStart = item.offsetTop;
                    const rowEnd = rowStart + item.offsetHeight;
                    const isFirstInRow = index === 0 || avatarItems[index - 1].offsetTop !== rowStart;
                    const isLastInRow = index === avatarItems.length - 1 || avatarItems[index + 1].offsetTop !== rowStart;
                    return {
                        isFirstInRow: isFirstInRow && !isLastInRow,
                        isLastInRow: isLastInRow && !isFirstInRow,
                    };
                });
                setAvatarClasses(newAvatarClasses);
            }
        };

        updateAvatarClasses();
        window.addEventListener('resize', updateAvatarClasses);
        return () => window.removeEventListener('resize', updateAvatarClasses);
    }, [avatars]);

    const handleAvatarClick = (avatar) => {
        setAvatarToShow(avatar);
        setShowVariantVideo(null);
    };

    const handleVariantClick = (variant) => {
        setSelectedAvatar(avatarToShow);
        setSelectedVariant(variant);
        onAvatarSelect(avatarToShow, variant);
    };

    const handlePreviewClick = (variant) => {
        setShowVariantVideo(variant);
    };

    const handleClosePopup = (e) => {
        setShowVariantVideo(null);
    };

    const handleCloseVariants = (e) => {
        e.stopPropagation();
        setAvatarToShow(null);
    };

    const filteredAvatars = avatars.filter(avatar =>
        avatar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.avatarContainer}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search avatars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            </div>
            <div className={styles.avatarList} ref={avatarListRef}>
                {filteredAvatars.map((avatar, index) => (
                    <div
                        key={avatar.id}
                        className={`${styles.avatarItem} ${avatarClasses[index]?.isFirstInRow ? styles.avatarFirst : ''} 
                                    ${avatarClasses[index]?.isLastInRow ? styles.avatarLast : ''} 
                                    ${avatarToShow && avatarToShow.id === avatar.id ? styles.avatarShowed : ''}
                                    ${selectedAvatar && selectedAvatar.id === avatar.id ? styles.selectedAvatar : ''}`}
                        onClick={() => handleAvatarClick(avatar)}
                    >
                        <img src={avatar.variants[0].thumbnail} alt={avatar.name} className={styles.avatarImage} />
                        <h3>{avatar.name}</h3>
                        {avatarToShow && avatarToShow.id === avatar.id && (
                            <div className={styles.variantsContainer}>
                                <button onClick={handleCloseVariants} className={styles.closeButton}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                                <div className={styles.variantsList}>
                                    {avatarToShow.variants.map((variant) => (
                                        <div key={variant.id} className={`${styles.variantItem} 
                                            ${selectedAvatar && selectedAvatar.id === avatar.id && selectedVariant && selectedVariant.id === variant.id ? styles.selectedVariant : ''}`} onClick={(e) => e.stopPropagation()}>
                                            <img
                                                src={variant.thumbnail}
                                                alt={variant.name}
                                                className={styles.variantImage}
                                                onClick={() => handleVariantClick(variant)}
                                            />
                                            <h4>{variant.name}</h4>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePreviewClick(variant);
                                                }}
                                                className={styles.previewButton}
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {showVariantVideo && (
                    <div className={styles.popup} onClick={handleClosePopup}>
                        <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                            <button onClick={handleClosePopup} className={styles.closeButton}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <video controls className={styles.videoPlayer}>
                                <source src={showVariantVideo.intro} type="video/mp4" />
                                Your browser does not support the video element.
                            </video>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvatarList;
