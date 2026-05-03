import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import CartDrawer from './components/cart/CartDrawer';

// Pages
import Home from './pages/Home';
import Productos from './pages/Productos';
import QuienesSomos from './pages/QuienesSomos';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-brand-gray-light text-brand-black flex flex-col font-sans selection:bg-brand-orange selection:text-white">
            <Routes>
              {/* Admin routes without standard layout */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminPanel />} />

              {/* Public routes with standard layout */}
              <Route path="/*" element={
                <>
                  <Navbar 
                    onOpenCart={() => setIsCartOpen(true)} 
                    onToggleSidebar={() => setIsSidebarOpen(true)} 
                  />
                  
                  <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                  />
                  
                  <CartDrawer 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                  />

                  <main className="flex-grow pt-16">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/productos" element={<Productos />} />
                      <Route path="/quienes-somos" element={<QuienesSomos />} />
                      <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                  </main>

                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
