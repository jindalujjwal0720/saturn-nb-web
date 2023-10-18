import React from "react";
import styles from "./Markdown.module.css";

const Markdown = ({ content }) => {
  const renderMarkdown = () => {
    const h1Regex = /# (.*)\n/;
    const h2Regex = /## (.*)\n/;

    content = content.replace(h2Regex, "<h2>$1</h2>");
    content = content.replace(h1Regex, "<h1>$1</h1>");

    const boldRegex = /\*(.*)\*/;
    const italicRegex = /_(.*)_/;
    const strikeThroughRegex = /~(.*)~/;

    content = content.replace(boldRegex, "<b>$1</b>");
    content = content.replace(italicRegex, "<i>$1</i>");
    content = content.replace(strikeThroughRegex, "<s>$1</s>");

    content = content.replace(/(?:\r\n|\r|\n)/g, "<br>");

    const lines = content.split("<br>");
    let newContent = "";
    lines.forEach((line) => {
      if (line.startsWith("- ")) {
        newContent += `<li>${line.substring(2)}</li>`;
      } else {
        newContent += `<p>${line}</p>`;
      }
    });
    content = newContent;

    const ulRegex = /<li>(.*)<\/li>/g;
    content = content.replace(ulRegex, "<ul><li>$1</li></ul>");

    return content;
  };

  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
    />
  );
};

export default Markdown;
