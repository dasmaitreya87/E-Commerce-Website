import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ShopContextProvider from './context/ShopContext';

console.log("main.jsx loaded");

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

