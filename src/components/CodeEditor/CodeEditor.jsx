import React from "react";
import styles from "./CodeEditor.module.css";
import Editor from "react-simple-code-editor";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import {
  selectActiveCell,
  updateCell,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";

const CodeEditor = () => {
  const dispatch = useDispatch();
  const activeCell = useSelector(selectActiveCell);

  const handleCodeChange = (code) => {
    dispatch(updateCell({ id: activeCell.id, content: code }));
  };

  const highlightCode = (value) => {
    let highlightedCode = "";
    if (!value) return;
    try {
      highlightedCode = hljs.highlight(value, {
        language: "javascript",
      }).value;
    } catch (err) {
      console.log(err);
    }
    return highlightedCode;
  };

  return (
    <pre className={styles.codePre}>
      <Editor
        value={activeCell.value.content}
        onValueChange={handleCodeChange}
        highlight={highlightCode}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
        }}
      />
    </pre>
  );
};

export default CodeEditor;
