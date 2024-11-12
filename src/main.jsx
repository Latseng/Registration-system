import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux";
import store from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="198340289328-0j8s2mgt8a10sau8mo1l308e5uqiav1m.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
