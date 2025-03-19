import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { store } from "./redux/store/store";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
