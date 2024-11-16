import React from "react";
import styles from "./Navbar.module.css";
import Logo from "../Logo/Logo";
import {
  selectSaved,
  saveNotebooks,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const saved = useSelector(selectSaved);
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    if (!saved) {
      if (!window.confirm("You have unsaved changes. Do you want to leave?")) {
        return;
      }
    }
    navigate("/");
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div onClick={handleNavigate}>
            <Logo />
          </div>
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
