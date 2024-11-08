// CheckoutPage.jsx

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const location = useLocation();
    const product = location.state?.product;
    const totalPrice = product ? product.price : location.state?.totalPrice || 0;

    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Delivery Information Submitted: ", deliveryInfo);
    };

    return (
        <div className="checkout-page-container">
            <h2>Checkout</h2>

            {product && (
                <div className="product-summary">
                    <h3>{product.name}</h3>
                    <p>Price: R{product.price}</p>
                </div>
            )}

            <form className="delivery-form" onSubmit={handleSubmit}>
                <h3>Delivery Information</h3>
                <input type="text" name="fullName" placeholder="Full Name" value={deliveryInfo.fullName} onChange={handleInputChange} required />
                <input type="text" name="address" placeholder="Address" value={deliveryInfo.address} onChange={handleInputChange} required />
                <input type="text" name="city" placeholder="City" value={deliveryInfo.city} onChange={handleInputChange} required />
                <input type="text" name="postalCode" placeholder="Postal Code" value={deliveryInfo.postalCode} onChange={handleInputChange} required />
                <input type="text" name="country" placeholder="Country" value={deliveryInfo.country} onChange={handleInputChange} required />
                <button type="submit">Submit Delivery Info</button>
            </form>

            <div className="payment-method">
                <h3>Payment Method</h3>
                <PayPalScriptProvider options={{ "client-id": "AWfif6efyAwZ2bndKS2bigPPziJ_-bda7qnmrpk1peFeXyKPN5hVwVE1dQ8lTekBjTRjJO5lp4046qlR" }}>
                    <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: totalPrice,
                                    },
                                }],
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                                alert("Transaction completed by " + details.payer.name.given_name);
                            });
                        }}
                    />
                </PayPalScriptProvider>
            </div>
        </div>
    );
};

export default CheckoutPage;
