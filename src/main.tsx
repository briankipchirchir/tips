import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PaymentProvider>
        <App />
        </PaymentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

