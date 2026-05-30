import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./index.css";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppRoutes />
    </Router>
  );
}

export default App;
