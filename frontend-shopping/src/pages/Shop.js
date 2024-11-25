import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Import useParams for dynamic URL parameters
import styles from './Shop.module.css';
import { ProductContext } from '../Context/StoreContext';
import ProductCard from '../components/ProductCard'; // Import the ProductCard component
import axios from 'axios'; // For making API requests

const Shop = () => {
    const { products, loading, error } = useContext(ProductContext); // Get products from context
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const location = useLocation(); // Get the current location (URL)
    const { category } = useParams(); // Extract the category from the URL path using useParams

    // Get the search query from the URL
    const query = new URLSearchParams(location.search).get('search') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoadingSearch(true);

            try {
                let filtered = products;

                // If there is a search query, fetch matching products based on the query
                if (query) {
                    const response = await axios.get(`http://localhost:4000/api/products/search?query=${query}`);
                    const matchingProductIds = response.data.map(product => product._id);
                    filtered = filtered.filter(product => matchingProductIds.includes(product._id));
                }

                // Apply category filter if category is present in the URL path
                if (category && category !== 'shop') { // Avoid filtering by 'shop' as category
                    filtered = filtered.filter(product => product.category.toLowerCase() === category);
                }

                setFilteredProducts(filtered);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setFilteredProducts([]); // Show no results if error occurs
            } finally {
                setLoadingSearch(false);
            }
        };

        // Call the function to fetch and filter products
        fetchSearchResults();

    }, [query, category, products]); // Re-run the effect when query, category, or products change

    if (loading || loadingSearch) {
        return <div className={styles.message}>Loading products...</div>;
    }

    if (error) {
        return <div className={styles.message}>{error}</div>;
    }

    return (
        <section className={styles.shopSection}>
            <h2 className={styles.sectionTitle}>
                {category && category !== 'shop' ? `Showing products in category: "${category}"` : query ? `Search results for: "${query}"` : 'Shop All Products'}
            </h2>
            <div className={styles.productGrid}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className={styles.message}>No products found.</div>
                )}
            </div>
        </section>
    );
};

export default Shop;
