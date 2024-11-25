import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context with a default value
export const ProductContext = createContext(null);

const ProductContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]); // State to store products
    const [loading, setLoading] = useState(true); // State to track loading status
    const [productError, setProductError] = useState(null); // Separate state for product fetching error
    const [cart, setCart] = useState([]); // State to store cart items
    const [cartError, setCartError] = useState(null); // Separate state for cart fetching error

    // Create a custom axios instance for authenticated requests
    const axiosWithCredentials = axios.create({
        withCredentials: true,
    });

    // Create a default axios instance for non-authenticated requests
    const axiosWithoutCredentials = axios.create({
        withCredentials: false,
    });

    // Fetch products from API using axiosWithoutCredentials
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosWithoutCredentials.get("http://localhost:4000/api/products");

                // Map products to include full image URL
                const updatedProducts = response.data.products.map((product) => ({
                    ...product,
                    image: `http://localhost:4000/${product.image}`, // Add base URL to image path
                }));
                setProducts(updatedProducts); // Update state with modified product data
                setLoading(false);
            } catch (err) {
                setProductError("Failed to load products");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true); // Start loading

            const response = await axiosWithCredentials.get("http://localhost:4000/api/products/cart");

            // Map cart items to include full image URL
            const updatedCart = response.data.cart.map((item) => ({
                ...item,
                image: `http://localhost:4000/${item.image}`, // Add base URL to product image path
            }));

            setCart(updatedCart); // Update state with modified cart data
        } catch (err) {
            setCartError("Failed to load cart");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch cart items using axiosWithCredentials
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true); // Start loading

                const response = await axiosWithCredentials.get("http://localhost:4000/api/products/cart");

                // Map cart items to include full image URL
                const updatedCart = response.data.cart.map((item) => ({
                    ...item,
                    image: `http://localhost:4000/${item.image}`, // Add base URL to product image path
                }));

                setCart(updatedCart); // Update state with modified cart data
            } catch (err) {
                setCartError("Failed to load cart");
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchCart();
    }, []);

    // Add item to cart using axiosWithCredentials
    const addToCart = async (productId, quantity, price) => {
        try {
            const response = await axiosWithCredentials.post(
                "http://localhost:4000/api/products/cart/add",
                { productId, quantity, price }
            );

            setCart(response.data.cart); // Update the cart state with the latest data
        } catch (err) {
            setCartError("Failed to add item to cart");
        }
    };

    // Delete item from cart using axiosWithCredentials
    const deleteFromCart = async (productId) => {
        try {
            const response = await axiosWithCredentials.delete(
                `http://localhost:4000/api/products/cart/delete/${productId}`
            );

            setCart(response.data.cart); // Update the cart state with the latest data after deletion
        } catch (err) {
            setCartError("Failed to remove item from cart");
        }
    };

    // Context value to be passed to the provider
    const contextValue = {
        products,
        cart,
        loading,
        productError, // Pass product error to the context
        cartError, // Pass cart error to the context
        addToCart, // Add this method to the context
        deleteFromCart, // Add the delete function to the context
        fetchCart
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContextProvider;
