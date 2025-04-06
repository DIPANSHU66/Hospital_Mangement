import { StrictMode, useState, createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

export const Context = createContext({ isAuthenticated: false });

const AppWrapper = () => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [user, setuser] = useState({});

  return (
    <Context.Provider
      value={{ isAuthenticated, setisAuthenticated, user, setuser }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
