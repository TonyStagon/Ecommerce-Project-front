import React, { useEffect, useState } from 'react';
import CreateStore from './CreateStore';
import ProductGrid from './ProductGrid';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const UserDashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h1>Add Product To Sell</h1>
            <CreateStore />
            <h2>Products</h2>
            <ProductGrid products={products} />
        </div>
    );
};

export default UserDashboard;
