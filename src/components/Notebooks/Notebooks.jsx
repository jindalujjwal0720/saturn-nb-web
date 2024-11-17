import React from "react";
import styles from "./Notebooks.module.css";
import {
  selectNotebooks,
  setActiveNotebookId,
  createNotebook,
  updateNotebook,
  disposeNotebook,
  appendOpenedNotebook,
} from "../../state/redux/notebook/notebookSlice";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Notebooks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notebooks = useSelector(selectNotebooks);
  const [isPortrait, setIsPortrait] = React.useState(
    window.innerHeight > window.innerWidth
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNameChange = (e, notebook) => {
    if (e.target.value.length < 1) return;
    dispatch(updateNotebook({ id: notebook.id, name: e.target.value }));
  };

  const handleDelete = (e, notebook) => {
    e.stopPropagation();
    const confirm = window.confirm(
      `Are you sure you want to delete ${notebook.name}? This action cannot be undone.`
    );
    if (!confirm) return;
    dispatch(disposeNotebook(notebook.id));
  };

  const handleNotebookClick = (notebook) => {
    dispatch(setActiveNotebookId(notebook.id));
    dispatch(appendOpenedNotebook(notebook));
    navigate("/editor");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Notebooks</div>
      </div>
      <table className={styles.notebooks}>
        <thead>
          <tr className={styles.notebook + " " + styles.head}>
            <th className={styles.title}>Name</th>
            {!isPortrait && <th className={styles.id}>ID</th>}
            {!isPortrait && <th className={styles.count}>Cells</th>}
            <th className={styles.actions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notebooks.map((notebook) => (
            <tr
              className={styles.notebook}
              key={notebook.id}
              onClick={() => handleNotebookClick(notebook)}
            >
              <td>
                <input
                  className={styles.title}
                  value={notebook.name}
                  onChange={(e) => handleNameChange(e, notebook)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              {!isPortrait && <td className={styles.id}>{notebook.id}</td>}
              {!isPortrait && (
                <td className={styles.count}>{notebook.cells.length}</td>
              )}
              <td className={styles.actions}>
                <button
                  className={styles.delete}
                  onClick={(e) => handleDelete(e, notebook)}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className={styles.addNotebook}
        onClick={() => dispatch(createNotebook())}
      >
        Add Notebook
      </button>
    </div>
  );
};

export default Notebooks;
