import React from "react";
import Link from "next/link";
import styles from "./Header.module.css"; // Importing CSS module for styling

function Header() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/Users/Settings/User_Information" className={styles.brand}>
          つくえラボ
        </Link>
      </div>
    </nav>
  );
}

export default Header;
