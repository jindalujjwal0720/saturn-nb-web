import React from "react";
import styles from "./CodeViewer.module.css";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

const CodeViewer = ({ code }) => {
  const highlightedCode = hljs.highlight(code, {
    language: "javascript",
  }).value;

  return (
    <pre className={styles.codePre}>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};

export default CodeViewer;
