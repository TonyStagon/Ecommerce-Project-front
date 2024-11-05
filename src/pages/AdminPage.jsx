import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

const AdminPage = () => {
  return (
    <div>
      <h2>Admin Panel</h2>
      <ProductForm />
      <ProductList />
    </div>
  );
};

export default AdminPage;
