import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import HomePage from './pages/HomePage';
import EligibilityPage from './pages/EligibilityPage';
import ProductsPage from './pages/ProductsPage';
import GuidePage from './pages/GuidePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const pages = {
    home: <HomePage onNavigate={handleNavigate} />,
    eligibility: <EligibilityPage />,
    products: <ProductsPage />,
    guide: <GuidePage />,
    login: <LoginPage onNavigate={handleNavigate} />,
    register: <RegisterPage onNavigate={handleNavigate} />,
    dashboard: <DashboardPage onNavigate={handleNavigate} />,
    notfound: <NotFoundPage onNavigate={handleNavigate} />,
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {pages[currentPage] || pages.home}
      <ToastContainer />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
