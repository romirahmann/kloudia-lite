/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import { UserView } from "./components/UserView.jsx";
import { NotFound } from "./components/NotFound.jsx";
import { Login } from "./components/Login.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Maintenance } from "./components/Maintenance.jsx";
import { ApiUrl } from "./components/context/urlApi.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // <Maintenance />

            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
        {/* <Route path="/maintenance" element={<UserView />} /> */}
      </Routes>
    </Router>
  </StrictMode>
);
