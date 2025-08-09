import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home.jsx';
import Events from './components/Events.jsx';
import Gallery from './components/Gallery.jsx';
import News from './components/News.jsx';
import Contact from './components/Contact.jsx';
import Executive from './components/Executive.jsx';
import Institutions from './components/Institutions.jsx';
import EventRegistration from './components/EventRegistration.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PaymentForm from './components/PaymentForm';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

// Main Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="page-content">
        {children}
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
              </Routes>
            </AdminLayout>
          } />

          {/* Main Website Routes */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="news" element={<News />} />
                <Route path="executive" element={<Executive />} />
                <Route path="institutions" element={<Institutions />} />
                <Route path="contact" element={<Contact />} />
                <Route path="register" element={<EventRegistration />} />
                <Route path="payment" element={<PaymentForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
