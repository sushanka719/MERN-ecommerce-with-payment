import React, { useContext, useState } from 'react';
import styles from './Recommended.module.css';
import { ProductContext } from '../Context/StoreContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ITEMS_PER_PAGE = 4;

const Recommended = () => {
    const { products, loading, error } = useContext(ProductContext); // Get products from context
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const navigate = useNavigate();

    const currentData = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section className={styles.recommendedSection}>
            <h2 className={styles.sectionTitle}>Recommended Glasses</h2>
            <div className={styles.glassesGrid}>
                {currentData.map((product) => (
                    <div key={product._id} className={styles.glassCard} onClick={() => handleClick(product._id)}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.glassImage}
                        />
                        <div className={styles.glassInfo}>
                            <h3 className={styles.glassName}>{product.name}</h3>
                            <p className={styles.glassDescription}>{product.description}</p>
                            <p className={styles.glassPrice}>${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                {[...Array(totalPages).keys()].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`${styles.pageButton} ${index + 1 === currentPage ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Recommended;
