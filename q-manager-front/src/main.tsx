import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// @ts-ignore
import 'styles/index.css';
import App from 'pages/App.tsx';
import Header from 'pages/layout/Header';
import Footer from 'pages/layout/Footer';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Header />
      <App />
      <Footer />
    </StrictMode>
  </BrowserRouter>,
);
