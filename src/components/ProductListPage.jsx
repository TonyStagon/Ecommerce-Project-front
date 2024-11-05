// frontend/src/components/ProductListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setError("Unable to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Function to handle deleting a product
    const handleDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
            setError("Unable to delete product. Please try again.");
        }
    };

    // Function to navigate to the edit page for a product
    const handleEdit = (id) => {
        navigate(`/edit-product/${id}`);
    };

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product.id} className="product-item">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <div className="product-actions">
                        <button onClick={() => handleEdit(product.id)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductListPage;
