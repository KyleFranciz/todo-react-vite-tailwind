import { Route, Routes } from "react-router-dom";
import "./App.css";

import { TodoPage } from "./pages/todo-page";
import { Navbar } from "./components/Navbar";

import HomePage from "./pages/home";

function App() {
  return (
    <>
      <div className="fixed">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </>
  );
}

export default App;
