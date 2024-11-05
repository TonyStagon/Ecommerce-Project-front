// frontend/src/components/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './RegisterPage.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setSuccessMessage(''); // Clear any previous messages
        setErrorMessage('');

        try {
            const response = await api.post('/auth/register', { email, password });
            
            if (response.status === 201) { // Assuming a 201 status code for successful creation
                setSuccessMessage('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after a short delay
                }, 2000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Register</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
