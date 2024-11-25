import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the Admin Context
const AdminContext = createContext();

// Custom hook to use Admin Context
export const useAdmin = () => {
    return useContext(AdminContext);
};

// Admin Context Provider
export const AdminProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [adminProducts, setAdminProducts] = useState([]);

    // Fetch admin products
    const fetchAdminProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/products');
            setAdminProducts(response.data.products);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Admin action to add a product
    const addProduct = async (productData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/product', productData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccessMessage(response.data.message);
            fetchAdminProducts(); // Refresh the product list
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    // Admin action to update a product (optional)
    const updateProduct = async (productId, productData) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/admin/product/${productId}`, productData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccessMessage(response.data.message);
            fetchAdminProducts(); // Refresh the product list
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    // Admin action to delete a product (optional)
    const deleteProduct = async (productId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/admin/product/${productId}`);
            setSuccessMessage(response.data.message);
            fetchAdminProducts(); // Refresh the product list
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    // UseEffect to fetch initial data when the component mounts
    useEffect(() => {
        fetchAdminProducts();
    }, []);

    return (
        <AdminContext.Provider
            value={{
                loading,
                errorMessage,
                successMessage,
                adminProducts,
                addProduct,
                updateProduct,
                deleteProduct,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
