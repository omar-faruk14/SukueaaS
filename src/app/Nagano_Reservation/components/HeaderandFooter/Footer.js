import React from "react";
import styles from "./Footer.module.css"; // Importing CSS module for styling

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; 2024 RAPOSA Co. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
