import React from "react";
import styles from "./Navbar.module.css";
import Logo from "../Logo/Logo";
import {
  selectSaved,
  saveNotebooks,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const saved = useSelector(selectSaved);

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          {saved ? (
            <span className={styles.savedInfo}>All changes are saved</span>
          ) : (
            <button
              className={styles.save}
              onClick={() => dispatch(saveNotebooks())}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
