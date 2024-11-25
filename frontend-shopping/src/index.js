import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import StoreContextProvider from './Context/StoreContext';
import { AuthProvider } from './Context/authStore';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StoreContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
