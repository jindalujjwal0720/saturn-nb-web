import React from "react";
import styles from "./Markdown.module.css";

const Markdown = ({ content }) => {
  const renderMarkdown = () => {
    const lines = content.split("\n");

    const h1Regex = /^# (.*)$/;
    const h2Regex = /^## (.*)$/;
    const pRegex = /^([^#].*)$/;
    const boldRegex = /\*(.*)\*/;
    const italicRegex = /_(.*)_/;
    const strikeThroughRegex = /~(.*)~/;

    const renderLine = (line, index) => {
      if (h2Regex.test(line)) {
        return <h2 key={index}>{line.match(h2Regex)[1]}</h2>;
      } else if (h1Regex.test(line)) {
        return <h1 key={index}>{line.match(h1Regex)[1]}</h1>;
      } else if (pRegex.test(line)) {
        return <p key={index}>{line.match(pRegex)[1]}</p>;
      } else if (boldRegex.test(line)) {
        return <b key={index}>{line.match(boldRegex)[1]}</b>;
      } else if (italicRegex.test(line)) {
        return <i key={index}>{line.match(italicRegex)[1]}</i>;
      } else if (strikeThroughRegex.test(line)) {
        return <s key={index}>{line.match(strikeThroughRegex)[1]}</s>;
      } else {
        return <React.Fragment key={index}>{line}</React.Fragment>;
      }
    };

    return lines.map((line, index) => renderLine(line, index));
  };

  return <div className={styles.markdown}>{renderMarkdown(content)}</div>;
};

export default Markdown;
