import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store/store';
// @ts-ignore
import 'styles/index.css';
import App from 'pages/App.tsx';
import Header from 'pages/layout/Header';
import Footer from 'pages/layout/Footer';

function LayoutWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Header />}
      <App />
      {!isAuthPage && <Footer />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <LayoutWrapper />
      </StrictMode>
    </BrowserRouter>
  </Provider>,
);
