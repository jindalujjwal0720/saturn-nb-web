import React from "react";
import styles from "./Logo.module.css";

const Logo = ({ scale }) => {
  return (
    <div className={styles.logo} style={{ transform: `scale(${scale})` }}>
      <div className={styles.saturn}>
        <div className={styles.ring}></div>
        <div className={styles.planet}></div>
      </div>
      <div className={styles.text}>Saturn</div>
    </div>
  );
};

export default Logo;
