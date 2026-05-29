import React from "react";
import { createRoot } from "react-dom/client";
import AfforditPrototype from "./App.jsx";
import "./styles.css";
import "./home-refresh.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AfforditPrototype />
  </React.StrictMode>,
);