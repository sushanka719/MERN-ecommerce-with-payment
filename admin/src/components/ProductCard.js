import React from "react";
import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onUnlist }) => {
    // Limit the description to 100 characters
    const truncatedDescription =
        product.description.length > 100
            ? product.description.substring(0, 100) + "..."
            : product.description;

    return (
        <div
            className={`${styles.card} ${product.stock === 0 ? styles.outOfStockCard : ""
                }`}
        >
            <img
                src={product.image}
                alt={product.name}
                className={styles.image}
            />
            <h3 className={styles.title}>{product.name}</h3>
            <p className={styles.description}>{truncatedDescription}</p>
            <p className={styles.price}>Price: ${product.price}</p>
            <p className={styles.stock}>
                {product.stock === 0 ? (
                    <span className={styles.outOfStock}>Out of Stock</span>
                ) : product.stock < 5 ? (
                    <span className={styles.lowStock}>Low Stock</span>
                ) : (
                    <span>In Stock: {product.stock}</span>
                )}
            </p>
            <p className={styles.category}>Category: {product.category}</p>
            <div className={styles.actions}>
                <Link to={`/admin/update/${product._id}`}>
                    <button className={styles.editBtn}>Edit</button>
                </Link>
                <button
                    className={styles.unlistBtn}
                    onClick={() => onUnlist(product._id)}
                >
                    Unlist
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
