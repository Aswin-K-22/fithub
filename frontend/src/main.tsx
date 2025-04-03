import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import App from './App.tsx';
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
<Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Provider>
  </StrictMode>,
);
