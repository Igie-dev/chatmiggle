import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router/Router";
import "./index.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider } from "react-redux";
import store from "@/service/store";
if (import.meta.env.VITE_NODE_ENV === "production") disableReactDevTools();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<Router />
		</Provider>
	</React.StrictMode>
);
