import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HomePage.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);

                // Initialize the hovered index for each product
                const initialIndex = {};
                productList.forEach((product) => {
                    initialIndex[product.id] = 0; // Start with the first image
                });
                setHoveredIndex(initialIndex);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        fetchProducts();
    }, []);

    const handleMouseEnter = (productId) => {
        setHoveredIndex((prevIndex) => ({
            ...prevIndex,
            [productId]: (prevIndex[productId] + 1) % products.find((p) => p.id === productId).images.length,
        }));
    };

    const handleMouseLeave = (productId) => {
        setHoveredIndex((prevIndex) => ({
            ...prevIndex,
            [productId]: 0, // Reset to the first image when mouse leaves
        }));
    };

    return (
        <div className="products-container">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                    <Link to={`/product/${product.id}`}> {/* Link to the product detail page */}
                        <div className="images-container">
                            {product.images && product.images.length > 0 && (
                                <img
                                    src={product.images[hoveredIndex[product.id]]}
                                    alt={`${product.name} image ${hoveredIndex[product.id] + 1}`}
                                    className="product-image"
                                    onMouseEnter={() => handleMouseEnter(product.id)}
                                    onMouseLeave={() => handleMouseLeave(product.id)}
                                />
                            )}
                        </div>
                    </Link>
                </div>
            ))}
            <footer className="footer">
                <p>All rights reserved by Arthur Maatalne ©2024</p>
            </footer>
        </div>
    );
};

export default HomePage;
