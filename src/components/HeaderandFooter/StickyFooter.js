// import React from "react";
// import styles from "./StickyFooter.module.css";

// const StickyFooter = ({ onShowLocation, onRefreshMap, onToggleLayers }) => {
//   return (
//     <footer className={styles.stickyFooter}>
//       <button className={styles.footerButton} onClick={onShowLocation}>
//         <i className="fas fa-location-arrow"></i>
//         <span>My Location</span>
//       </button>
//       <button className={styles.footerButton} onClick={onRefreshMap}>
//         <i className="fas fa-road"></i>
//         <span>Refresh</span>
//       </button>
//       <button className={styles.footerButton} onClick={onToggleLayers}>
//         <i className="fa-solid fa-house-medical"></i>
//         <span>Layers</span>
//       </button>
//     </footer>
//   );
// };

// export default StickyFooter;

import React from "react";
import styles from "./StickyFooter.module.css";

const StickyFooter = ({ onShowLocation}) => {
  return (
    <footer className={styles.stickyFooter}>
      <button className={styles.footerButton} onClick={onShowLocation}>
        <i className="fas fa-location-arrow"></i>
        <span>現在地</span>
      </button>
      <a href="https://liff.line.me/2006381311-VlRevLaD" className={styles.footerButton}>
        <i className="fas fa-list"></i>
        <span>施設一覧</span>
      </a>
      <a href="https://liff.line.me/2006381311-4BNmvWOq" className={styles.footerButton}>
        <i className="fa-solid fa-road"></i>
        <span>最適な順序</span>
      </a>
    </footer>
  );
};

export default StickyFooter;
