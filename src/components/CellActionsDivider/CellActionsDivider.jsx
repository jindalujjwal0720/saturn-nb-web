import React from "react";
import styles from "./CellActionsDivider.module.css";
import {
  createCell,
  disposeCell,
  selectActiveCellId,
} from "../../state/redux/notebook/notebookSlice";
import { useDispatch, useSelector } from "react-redux";

const CellActionsDivider = () => {
  const dispatch = useDispatch();
  const activeCellId = useSelector(selectActiveCellId);

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
    <div className={styles.wrapper}>
      <div className={styles.divider}></div>
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
          Delete
        </button>
      </div>
    </div>
  );
};

export default CellActionsDivider;
