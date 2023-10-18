import React, { useEffect, useRef, useState } from "react";
import styles from "./NotebookEditor.module.css";
import {
  selectActiveNotebook,
  selectNotebooks,
  setActiveNotebookId,
  createNotebook,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";
import Notebook from "../Notebook/Notebook";

const NotebookEditor = () => {
  const dispatch = useDispatch();
  const activeNotebook = useSelector(selectActiveNotebook);
  const notebooks = useSelector(selectNotebooks);
  const [openedNotebooks, setOpenedNotebooks] = useState(
    activeNotebook ? [activeNotebook] : []
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleDropdownItemClick = (e, notebook) => {
    e.stopPropagation();
    setOpenedNotebooks((prev) => [...new Set([...prev, notebook])]);
    toggleDropdown();
    dispatch(setActiveNotebookId(notebook.id));
  };

  const handleTabClick = (notebook) => {
    dispatch(setActiveNotebookId(notebook.id));
  };

  const handleTabClose = () => {
    if (openedNotebooks.length === 1) {
      setOpenedNotebooks([]);
      dispatch(setActiveNotebookId(null));
    } else {
      setOpenedNotebooks((prev) =>
        prev.filter((nb) => nb.id !== activeNotebook.id)
      );
      dispatch(setActiveNotebookId(openedNotebooks[0].id));
    }
  };

  const handleCreateNotebook = (e) => {
    e.stopPropagation();
    dispatch(createNotebook());
    toggleDropdown();
  };

  return (
    <div className={styles.wrapper}>
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
              onClick={() => handleTabClick(nb)}
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
            <Notebook />
          ) : (
            <div className={styles.empty}>No notebook selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookEditor;
