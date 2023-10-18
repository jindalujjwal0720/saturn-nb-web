import { generateCell, generateNotebook } from "../../../utils/notebook";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  notebooks: [],
  activeNotebookId: null,
  activeCellId: null,
  notebookError: null,
  saved: false,
};

const notebookSlice = createSlice({
  initialState,
  name: "notebook",
  reducers: {
    loadNotebooks(state, action) {
      const notebooks = localStorage.getItem("notebooks");
      if (notebooks) {
        state.notebooks = JSON.parse(notebooks);
      }
      state.saved = true;
    },

    saveNotebooks(state, action) {
      localStorage.setItem("notebooks", JSON.stringify(state.notebooks));
      state.saved = true;
    },

    createNotebook(state, action) {
      const notebook = generateNotebook();
      state.notebooks.push(notebook);
      state.activeNotebookId = notebook.id;
      state.saved = false;
    },

    disposeNotebook(state, action) {
      state.notebooks = state.notebooks.filter(
        (notebook) => notebook.id !== action.payload
      );
      if (state.activeNotebookId === action.payload) {
        state.activeNotebookId = null;
        state.activeCellId = null;
      }
      state.saved = false;
    },

    updateNotebook(state, action) {
      const { id, name } = action.payload;
      const notebook = state.notebooks.find((notebook) => notebook.id === id);
      notebook.name = name;
      state.saved = false;
    },

    createCell(state, action) {
      if (!state.activeNotebookId) return;
      const { type } = action.payload;
      if (!type) return;
      const notebook = state.notebooks.find(
        (notebook) => notebook.id === state.activeNotebookId
      );
      if (!notebook) return;
      const cell = generateCell(type);
      const cellState = {
        id: cell.id,
        value: cell,
        loading: false,
        error: null,
        output: null,
      };
      if (state.activeCellId) {
        const index = notebook.cells.findIndex(
          (cell) => cell.id === state.activeCellId
        );
        notebook.cells.splice(index + 1, 0, cellState);
      } else {
        notebook.cells.push(cellState);
      }
      state.activeCellId = cell.id;
      state.saved = false;
    },

    disposeCell(state, action) {
      if (!state.activeNotebookId) return;
      const { id } = action.payload;
      const notebook = state.notebooks.find(
        (notebook) => notebook.id === state.activeNotebookId
      );
      notebook.cells = notebook.cells.filter((cell) => cell.id !== id);
      if (state.activeCellId === id) {
        state.activeCellId = null;
      }
      state.saved = false;
    },

    updateCell(state, action) {
      if (!state.activeCellId || !state.activeNotebookId) return;
      const { content } = action.payload;
      const notebook = state.notebooks.find(
        (notebook) => notebook.id === state.activeNotebookId
      );
      const cell = notebook.cells.find(
        (cell) => cell.value.id === state.activeCellId
      );
      cell.value.content = content;
      state.saved = false;
    },

    updateCellOutput(state, action) {
      if (!state.activeNotebookId) return;
      const { output, id } = action.payload;
      const notebook = state.notebooks.find(
        (notebook) => notebook.id === state.activeNotebookId
      );
      const cell = notebook.cells.find(
        (cell) => cell.value.id === id
      );
      cell.output = output;
      state.saved = false;
    },

    updateCellLoading(state, action) {
      if (!state.activeNotebookId) return;
      const { loading, id } = action.payload;
      const notebook = state.notebooks.find(
        (notebook) => notebook.id === state.activeNotebookId
      );
      const cell = notebook.cells.find(
        (cell) => cell.value.id === id
      );
      cell.loading = loading;
      state.saved = false;
    },

    updateCellError(state, action) {
      if (!state.activeNotebookId) return;
      const { error, id } = action.payload;
      const notebook = state.notebooks.find(
        (notebook) => notebook.id === state.activeNotebookId
      );
      const cell = notebook.cells.find(
        (cell) => cell.value.id === id
      );
      cell.error = error;
      state.saved = false;
    },

    setActiveNotebookId(state, action) {
      state.activeNotebookId = action.payload;
    },

    setActiveCellId(state, action) {
      state.activeCellId = action.payload;
    },
  },
});

export const selectNotebooks = (state) => state.notebook.notebooks;
export const selectActiveNotebookId = (state) =>
  state.notebook.activeNotebookId;
export const selectActiveNotebook = (state) =>
  state.notebook.notebooks.find(
    (notebook) => notebook.id === state.notebook.activeNotebookId
  );
export const selectActiveCellId = (state) => state.notebook.activeCellId;
export const selectActiveCell = (state) =>
  state.notebook.notebooks
    .find((notebook) => notebook.id === state.notebook.activeNotebookId)
    ?.cells.find((cell) => cell.id === state.notebook.activeCellId);
export const selectNotebookError = (state) => state.notebook.notebookError;
export const selectSaved = (state) => state.notebook.saved;
export const selectNotebooksMetadata = (state) =>
  state.notebook.notebooks.map((notebook) => ({
    id: notebook.id,
    name: notebook.name,
    cellsCount: notebook.cells.length,
  }));

export const {
  loadNotebooks,
  saveNotebooks,
  createNotebook,
  disposeNotebook,
  updateNotebook,
  createCell,
  disposeCell,
  updateCell,
  setActiveNotebookId,
  setActiveCellId,
  updateCellOutput,
  updateCellLoading,
  updateCellError,
} = notebookSlice.actions;
export default notebookSlice.reducer;
