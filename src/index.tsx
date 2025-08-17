import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import App from "./app";

import Input from "./components/common/Input/Input";
import Button from "./components/common/Button/Button";

import "./index.css";

import store from "./redux/store";

import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Input />
        <Button size="small">ola</Button>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
