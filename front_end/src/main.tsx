import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router/Router";
import "./index.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider } from "react-redux";
import store from "@/service/store";
import { ThemeProvider } from "@/components/ui/theme-provider";
if (import.meta.env.VITE_NODE_ENV === "production") disableReactDevTools();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
