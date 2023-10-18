import React, { useEffect, useRef } from "react";
import styles from "./Cell.module.css";
import {
  selectActiveCellId,
  setActiveCellId,
  updateCell,
  updateCellLoading,
  updateCellOutput,
  updateCellError,
} from "../../state/redux/notebook/notebookSlice";
import { useDispatch, useSelector } from "react-redux";
import Markdown from "../Markdown/Markdown";
import CodeViewer from "../CodeViewer/CodeViewer";
import CodeEditor from "../CodeEditor/CodeEditor";
import executionQueue from "../../utils/executionQueue";

const Cell = ({ cell, index }) => {
  const dispatch = useDispatch();
  const activeCellId = useSelector(selectActiveCellId);
  const contentParentRef = useRef(null);

  const handleContentChange = (e, cell) => {
    dispatch(updateCell({ id: cell.id, content: e.target.value }));
  };

  const handleTextAreaHeight = (e) => {
    const originalParentHeight = contentParentRef.current.style.height;
    contentParentRef.current.style.height = e.target.style.height;
    e.target.style.height = "1px";
    e.target.style.height = `${6 + e.target.scrollHeight}px`;
    contentParentRef.current.style.height = originalParentHeight;
  };

  const handleRunCode = (e, cell) => {
    e.stopPropagation();
    if (cell.loading) return;

    dispatch(updateCellLoading({ id: cell.id, loading: true }));
    dispatch(updateCellOutput({ id: cell.id, output: "" }));
    dispatch(updateCellError({ id: cell.id, error: "" }));

    executionQueue.addToQueue(
      cell.value.content,
      {},
      ({ output, error, context }) => {
        dispatch(updateCellOutput({ id: cell.id, output }));
        dispatch(updateCellError({ id: cell.id, error }));
        dispatch(updateCellLoading({ id: cell.id, loading: false }));
      }
    );
  };

  useEffect(() => {
    // Set initial height of textarea
    const textarea = contentParentRef.current.querySelector("textarea");
    if (!textarea) return;
    textarea.style.height = `${6 + textarea.scrollHeight}px`;
  }, []);

  useEffect(() => {
    // set event listener for tab key
    const textarea = contentParentRef.current.querySelector("textarea");
    if (!textarea) return;
    const handleTab = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        textarea.value = `${value.substring(0, start)}\t${value.substring(
          end
        )}`;
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  return (
    <div
      className={
        styles.cell + " " + (activeCellId === cell.id ? styles.active : "")
      }
      onClick={() => dispatch(setActiveCellId(cell.id))}
    >
      <div className={styles.cellControls}>
        <span className={styles.index}>[{index}]</span>
        {cell.value.type === "code" && (
          <div
            className={
              styles.runCode + " " + (cell?.loading ? styles.running : "")
            }
            onClick={(e) => handleRunCode(e, cell)}
          >
            <div className={styles.ring}></div>
            <div className={styles.icon}>▶</div>
          </div>
        )}
      </div>
      <div ref={contentParentRef} className={styles.cellContent}>
        {activeCellId === cell.id ? (
          cell.value.type === "text" ? (
            <textarea
              className={styles.textarea}
              value={cell.value.content}
              onChange={(e) => handleContentChange(e, cell)}
              onKeyUp={handleTextAreaHeight}
              onFocus={handleTextAreaHeight}
            />
          ) : (
            <CodeEditor
              code={cell.value.content}
              handleCodeChange={(e) => handleContentChange(e, cell)}
            />
          )
        ) : cell.value.type === "code" ? (
          <CodeViewer code={cell.value.content} />
        ) : (
          <Markdown content={cell.value.content} />
        )}
        {cell.value.type === "code" && cell.output && (
          <div className={styles.output}>
            <pre>{cell.output}</pre>
          </div>
        )}
        {cell.value.type === "code" && cell.error && (
          <div className={styles.error}>
            <pre>
              <p className={styles.message}>{cell.error.message}</p>
              <p className={styles.stack}>{cell.error.stack}</p>
            </pre>
          </div>
        )}
        <span className={styles.id}>{cell.id}</span>
      </div>
    </div>
  );
};

export default Cell;
