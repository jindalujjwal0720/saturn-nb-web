import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Notebooks from "../../components/Notebooks/Notebooks";
import { loadNotebooks } from "../../state/redux/notebook/notebookSlice";
import { useDispatch } from "react-redux";
import NotebookEditor from "../../components/NotebookEditor/NotebookEditor";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadNotebooks());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Notebooks />} />
        <Route path="/editor" element={<NotebookEditor />} />
      </Routes>
    </div>
  );
};

export default Home;
