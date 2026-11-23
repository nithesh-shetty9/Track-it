import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { store } from "../store/store";
import { bootstrap } from "../store/features/user.js";
import "./index.css";
import "./redesign.css";
import App from "./App.jsx";

store.dispatch(bootstrap());

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
