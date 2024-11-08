// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ProductListPage from './components/ProductListPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage'; // Import CheckoutPage
import UserDashboard from './components/UserDashboard';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import ProductDetail from './components/ProductDetail';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        // Monitor Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => setIsLoggedIn(false))
            .catch((error) => console.error('Error logging out:', error));
    };

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} /> {/* Add Checkout route */}
                {isLoggedIn && <Route path="/dashboard" element={<UserDashboard />} />}
            </Routes>
        </Router>
    );
};

export default App;
