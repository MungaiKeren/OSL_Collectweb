import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import NotFound from "./Pages/404";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ProtectedRoute from "./components/Login/ProtectedRoute";
import TBQuestionnaire from "./components/ToolBuilder/TBQuestionnaire";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/questionnaire/*" element={<TBQuestionnaire />} />
        <Route path="/*" element={<ProtectedRoute component={Home} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
