import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./i18n";
import "./index.css";

const applySavedTheme = () => {
  const savedData = localStorage.getItem("cooplabel-theme-data");
  if (!savedData) return;
  try {
    const theme = JSON.parse(savedData) as {
      primary?: string;
      secondary?: string;
      accent?: string;
      surface?: string;
    };
    const root = document.documentElement;
    if (theme.primary) root.style.setProperty("--color-brand-primary", theme.primary);
    if (theme.secondary) root.style.setProperty("--color-brand-secondary", theme.secondary);
    if (theme.accent) root.style.setProperty("--color-brand-accent", theme.accent);
    if (theme.surface) root.style.setProperty("--color-surface-base", theme.surface);
  } catch {
    // ignore invalid stored theme
  }
};

applySavedTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
