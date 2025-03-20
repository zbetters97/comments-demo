import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { AuthProvider } from "./context/AuthProvider";
import App from "./App";
import "./styles/pages/css/Comments.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
