import React from "react";
import styles from "./AvatarSelectionTab.module.css";

const AvatarSelectionTab = ({
  avatarsData,
  loadingAvatars,
  searchAvatar,
  setSearchAvatar,
  onAvatarSelected,
}) => (
  <div className={styles.avatarSelectionWrapper}>
    <h2 className={styles.avatarSelectionTitle}>
      Componentes del vídeo avatar
    </h2>
    <input
      className={styles.avatarSearchInput}
      placeholder="Search avatars..."
      value={searchAvatar}
      onChange={(e) => setSearchAvatar(e.target.value)}
    />
    <div className={styles.avatarGrid}>
      {loadingAvatars ? (
        <div className={styles.loaderContainer}>
          <span className={styles.loader}></span>
        </div>
      ) : (
        avatarsData
          .filter((a) =>
            a.name.toLowerCase().includes(searchAvatar.toLowerCase())
          )
          .map((avatar) => (
            <div
              key={avatar.id}
              className={styles.avatarCard}
              onClick={() => onAvatarSelected(avatar)}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                className={styles.avatarImg}
              />
              <div className={styles.avatarName}>{avatar.name}</div>
            </div>
          ))
      )}
    </div>
  </div>
);

export default AvatarSelectionTab;
