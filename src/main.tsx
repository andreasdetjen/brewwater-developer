import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ApiDocs } from "@/components/api-docs/ApiDocs";
import { Changelog } from "@/components/changelog/Changelog";
import { Impressum } from "@/components/impressum/Impressum";
import { LoginModal } from "@/components/login/LoginModal";
import "./styles.css";

function Redirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApiDocs />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Redirect to="https://brewwater.de/datenschutz" />} />
        <Route
          path="/login"
          element={
            <div className="min-h-screen flex items-center justify-center p-6 bg-muted/40">
              <LoginModal />
            </div>
          }
        />
        <Route path="*" element={<ApiDocs />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);