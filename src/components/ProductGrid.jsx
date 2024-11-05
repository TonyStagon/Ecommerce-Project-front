// ProductGrid.jsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './ProductGrid.css';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null); // Track editing state
    const [updatedProduct, setUpdatedProduct] = useState({}); // Track updated product data
    const [hoveredIndex, setHoveredIndex] = useState({}); // Track hovered index for images

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsList);

            // Initialize the hovered index for each product
            const initialIndex = {};
            productsList.forEach((product) => {
                initialIndex[product.id] = 0; // Start with the first image
            });
            setHoveredIndex(initialIndex);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Handle delete product
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    // Handle enable edit mode
    const enableEdit = (product) => {
        setEditingProductId(product.id);
        setUpdatedProduct(product);
    };

    // Handle save updated product
    const handleSave = async (id) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updatedProduct);
            setEditingProductId(null); // Exit edit mode
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    // Handle changes to updated product fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    // Handle mouse enter for images
    const handleMouseEnter = (productId) => {
        setHoveredIndex((prevIndex) => ({
            ...prevIndex,
            [productId]: (prevIndex[productId] + 1) % products.find((p) => p.id === productId).images.length,
        }));
    };

    return (
        <div className="product-grid">
            {products.map((product) => (
                <div className="product-card" key={product.id}>
                    {editingProductId === product.id ? (
                        // Editable fields
                        <>
                            <input
                                type="text"
                                name="name"
                                value={updatedProduct.name}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="price"
                                value={updatedProduct.price}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={updatedProduct.quantity}
                                onChange={handleChange}
                            />
                            <textarea
                                name="description"
                                value={updatedProduct.description}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        // Display fields
                        <>
                            <h3>{product.name}</h3>
                            <p>Price: R {product.price.toFixed(2)}</p>
                            <p>{product.quantity} : left </p>
                            <p>Description: {product.description}</p>
                        </>
                    )}

                    <div
                        className="product-images"
                        onMouseEnter={() => handleMouseEnter(product.id)}
                    >
                        {product.images.length > 0 && (
                            <img
                                src={product.images[hoveredIndex[product.id]]}
                                alt={`Product image`}
                                className="single-product-image"
                            />
                        )}
                    </div>

                    <div className="product-actions">
                        {editingProductId === product.id ? (
                            <>
                                <button onClick={() => handleSave(product.id)}>Save</button>
                                <button onClick={() => setEditingProductId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => enableEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
