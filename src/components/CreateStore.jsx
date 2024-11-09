import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure correct path to firebaseConfig
import './CreateStore.css';
const CreateStore = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const base64Promises = files.map(file => convertToBase64(file));
        Promise.all(base64Promises).then(setImages);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^R?\d*\.?\d*$/.test(value)) {
            setPrice(value);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const numericPrice = parseFloat(price.replace('R', '').trim());

            const product = {
                name: productName,
                price: numericPrice,
                quantity: Number(quantity),
                description,
                images, // Store Base64 encoded images in Firestore
            };

            // Add product to Firestore
            await addDoc(collection(db, 'products'), product);

            console.log('Product added successfully:', product);

            // Reset form
            setProductName('');
            setPrice('');
            setQuantity(0);
            setDescription('');
            setImages([]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="container">
            <h1>Create Store</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Product Name" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Price (Rands)" 
                    value={price} 
                    onChange={handlePriceChange} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageChange} 
                    required 
                />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default CreateStore;
