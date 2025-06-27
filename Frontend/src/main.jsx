import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";
import store from "./redux/store";

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
