export const generateCellId = () => `cell-${new Date().getTime().toString()}`;

export const generateNotebookId = () =>
  `notebook-${new Date().getTime().toString()}`;

export const generateNotebook = () => ({
  id: generateNotebookId(),
  name: "Untitled",
  cells: [],
  opened: false,
});

export const generateCell = (type) => ({
  id: generateCellId(),
  type,
  content: "",
});
