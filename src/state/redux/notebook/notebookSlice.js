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
      state.notebooks = state.notebooks.map((notebook) => ({
        ...notebook,
        cells: notebook.cells.map((cell) => ({
          ...cell,
          loading: false,
          executionTime: null,
          executed: false,
        })),
      }));
      state.saved = true;
    },

    saveNotebooks(state, action) {
      localStorage.setItem("notebooks", JSON.stringify(state.notebooks));
      state.saved = true;
    },

    createNotebook(state, action) {
      const notebook = generateNotebook();
      const count = state.notebooks.length;
      notebook.name = `${notebook.name} ${count + 1}`;
      state.notebooks.push({ ...notebook, opened: true });
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
        executed: false,
        executionTime: null,
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
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              cell.output = output;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    appendCellOutput(state, action) {
      if (!state.activeNotebookId) return;
      const { output, id } = action.payload;
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              cell.output = cell.output ? `${cell.output}\n${output}` : output;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    updateCellLoading(state, action) {
      if (!state.activeNotebookId) return;
      const { loading, id } = action.payload;
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              cell.loading = loading;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    updateCellError(state, action) {
      if (!state.activeNotebookId) return;
      const { error, id } = action.payload;
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              cell.error = error;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    appendCellError(state, action) {
      if (!state.activeNotebookId) return;
      const { error, id } = action.payload;
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              const { message, stack } = error;
              cell.error = cell.error
                ? {
                    message: `${cell.error.message}\n${message}`,
                    stack: `${cell.error.stack}\n${stack}`,
                  }
                : error;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    updateCellExecutionTime(state, action) {
      if (!state.activeNotebookId) return;
      const { executionTime, id } = action.payload;
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              cell.executionTime = executionTime;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    updateCellExecuted(state, action) {
      if (!state.activeNotebookId) return;
      const { executed, id } = action.payload;
      state.notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === state.activeNotebookId) {
          notebook.cells = notebook.cells.map((cell) => {
            if (cell.value.id === id) {
              cell.executed = executed ? true : false;
            }
            return cell;
          });
        }
        return notebook;
      });
      state.saved = false;
    },

    setActiveNotebookId(state, action) {
      state.activeNotebookId = action.payload;
      console.log("Active notebook id", state.activeNotebookId);
    },

    setActiveCellId(state, action) {
      state.activeCellId = action.payload;
    },

    appendOpenedNotebook(state, action) {
      const { id } = action.payload;
      const notebook = state.notebooks.find((notebook) => notebook.id === id);
      notebook.opened = true;
      notebook.cells = notebook.cells.map((cell) => ({
        ...cell,
        loading: false,
      }));
      localStorage.setItem("notebooks", JSON.stringify(state.notebooks));
    },

    removeOpenedNotebook(state, action) {
      const { id } = action.payload;
      const notebook = state.notebooks.find((notebook) => notebook.id === id);
      notebook.opened = false;
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
export const selectOpenedNotebooks = (state) =>
  state.notebook.notebooks.filter((notebook) => notebook.opened);

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
  appendCellOutput,
  updateCellLoading,
  updateCellError,
  appendCellError,
  updateCellExecutionTime,
  updateCellExecuted,
  appendOpenedNotebook,
  removeOpenedNotebook,
} = notebookSlice.actions;
export default notebookSlice.reducer;
