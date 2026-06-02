import { StrictMode, useEffect } from "react";

// Global scroll reveal observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
// Also observe dynamically added elements
const mutationObs = new MutationObserver(() => {
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
});
mutationObs.observe(document.body, { childList: true, subtree: true });
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ApiDocs } from "@/components/api-docs/ApiDocs";
import { Changelog } from "@/components/changelog/Changelog";
import { Impressum } from "@/components/impressum/Impressum";
import { Datenschutz } from "@/components/datenschutz/Datenschutz";
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
        <Route path="/datenschutz" element={<Datenschutz />} />
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