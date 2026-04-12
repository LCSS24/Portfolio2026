import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.jsx";
import Header from "./components/Header/Header.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <App />
  </StrictMode>,
);
