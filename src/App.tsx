import { Route, Routes } from "react-router-dom";
import "./App.css";

import { TodoPage } from "./pages/todo-page";
import { Navbar } from "./components/Navbar";

import HomePage from "./pages/home";
import { CompletedPage } from "./pages/CompletedPage";

//Create a global interface so that I can pass the info needed into the component element

function App() {
  //create a connection to the collection

  //use the getDocs function to get an array of objects that have all the information from the docs
  return (
    <>
      <div className="fixed">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/completed" element={<CompletedPage />} />
      </Routes>
    </>
  );
}

export default App;
