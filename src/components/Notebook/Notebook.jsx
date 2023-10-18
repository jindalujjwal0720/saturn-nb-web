import React from "react";
import styles from "./Notebook.module.css";
import {
  selectActiveNotebook,
  updateNotebook,
  createCell,
  disposeCell,
  selectActiveCellId,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";
import Cell from "../Cell/Cell";

const Notebook = () => {
  const dispatch = useDispatch();
  const activeNotebook = useSelector(selectActiveNotebook);
  const activeCellId = useSelector(selectActiveCellId);

  const handleNameChange = (e, notebook) => {
    if (e.target.value.length < 1) return;
    dispatch(updateNotebook({ id: notebook.id, name: e.target.value }));
  };

  const handleAddCode = () => {
    dispatch(createCell({ type: "code" }));
  };

  const handleAddText = () => {
    dispatch(createCell({ type: "text" }));
  };

  const handleDeleteCell = () => {
    dispatch(
      disposeCell({
        id: activeCellId,
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          className={styles.title}
          value={activeNotebook.name}
          onChange={(e) => handleNameChange(e, activeNotebook)}
        />
        <div className={styles.id}>ID: {activeNotebook.id}</div>
        <div className={styles.actions}>
          <button className={styles.add} onClick={handleAddCode}>
            +Code
          </button>
          <button className={styles.add} onClick={handleAddText}>
            +Text
          </button>
          <button
            className={styles.delete}
            onClick={handleDeleteCell}
            disabled={!activeCellId}
          >
            Delete Cell
          </button>
        </div>
      </div>
      <div className={styles.notebook}>
        <div className={styles.cells}>
          {activeNotebook.cells.map((cell, index) => (
            <Cell key={cell.id} cell={cell} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notebook;
