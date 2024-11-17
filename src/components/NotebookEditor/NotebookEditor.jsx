import React, { useEffect, useRef, useState } from "react";
import styles from "./NotebookEditor.module.css";
import {
  selectActiveNotebook,
  selectNotebooks,
  selectOpenedNotebooks,
  setActiveNotebookId,
  createNotebook,
  appendOpenedNotebook,
  removeOpenedNotebook,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";
import Notebook from "../Notebook/Notebook";
import { useNavigate } from "react-router-dom";

const NotebookEditor = () => {
  const dispatch = useDispatch();
  const activeNotebook = useSelector(selectActiveNotebook);
  const notebooks = useSelector(selectNotebooks);
  const openedNotebooks = useSelector(selectOpenedNotebooks);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeNotebook && openedNotebooks.length > 0) {
      dispatch(setActiveNotebookId(openedNotebooks[0].id));
    }
  }, [activeNotebook, openedNotebooks, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleDropdownItemClick = (e, notebook) => {
    e.stopPropagation();
    toggleDropdown();
    dispatch(appendOpenedNotebook(notebook));
    dispatch(setActiveNotebookId(notebook.id));
  };

  const handleTabClick = (notebook) => (e) => {
    e.stopPropagation();
    dispatch(setActiveNotebookId(notebook.id));
  };

  const handleTabClose = (e) => {
    e.stopPropagation();
    dispatch(removeOpenedNotebook(activeNotebook));
    dispatch(setActiveNotebookId(openedNotebooks[0].id));
    if (openedNotebooks.length === 1) {
      navigate("/");
    }
  };

  const handleCreateNotebook = (e) => {
    e.stopPropagation();
    toggleDropdown();
    dispatch(createNotebook());
  };

  if (!activeNotebook) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.empty}>No notebook selected</div>
        </div>
      </div>
    );
  }

  return (
    <div key={activeNotebook.id} className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.tabbar}>
          {openedNotebooks.map((nb, index) => (
            <div
              key={index}
              className={
                styles.tab +
                " " +
                (nb.id === activeNotebook.id ? styles.active : "")
              }
              onClick={handleTabClick(nb)}
            >
              <span>{nb.name}</span>
              {nb.id === activeNotebook.id && !isPortrait && (
                <div className={styles.close} onClick={handleTabClose}>
                  &times;
                </div>
              )}
            </div>
          ))}
          {!isPortrait && (
            <div
              ref={dropdownRef}
              className={styles.tab + " " + styles.newTab}
              onClick={toggleDropdown}
            >
              +
              {showDropdown && (
                <div className={styles.dropdown}>
                  {notebooks
                    .filter((nb) => !openedNotebooks.includes(nb))
                    .map((nb) => (
                      <div
                        key={nb.id}
                        className={styles.dropdownItem}
                        onClick={(e) => handleDropdownItemClick(e, nb)}
                      >
                        {nb.name}
                      </div>
                    ))}
                  <div
                    className={styles.dropdownItem}
                    onClick={(e) => handleCreateNotebook(e)}
                  >
                    Create a new Notebook
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.editor}>
          {activeNotebook ? (
            <Notebook key={activeNotebook.id} />
          ) : (
            <div className={styles.empty}>No notebook selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookEditor;
