import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import App from './App.tsx';
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 



createRoot(document.getElementById('root')!).render(
  <StrictMode>
<Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
