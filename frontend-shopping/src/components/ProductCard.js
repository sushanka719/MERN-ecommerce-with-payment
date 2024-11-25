import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ProductContext } from "../Context/StoreContext"; // Adjust import based on your context location
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import { toast } from "react-toastify"; // Import toast for showing messages
import styles from "./ProductCard.module.css";
import { useAuth } from '../Context/authStore';

const ProductCard = ({ product }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { addToCart } = useContext(ProductContext); // Access context
    const { isAuthenticated } = useAuth();


    // Navigate to the product detail page when clicked
    const handleCardClick = () => {
        navigate(`/product/${product._id}`); // Assuming product._id is the unique identifier
    };

    // Handle Add to Basket click
    const handleAddToBasket = (e) => {
        e.stopPropagation(); // Prevent triggering the card click handler

        // Check if the token exists in cookies
        const token = Cookies.get("token"); // Assuming the token is stored as "token"

        if (!isAuthenticated) {
            // If no token, show the toast asking the user to log in
            toast.error("Please log in to use the cart option.");
        } else {
            // If token exists, add the product to the cart
            addToCart(product._id, 1, product.price); // Add product to cart with quantity 1
            toast.success("Item added to cart!");
        }
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.imageContainer}>
                <img
                    src={product.image} // Adjust based on your backend
                    alt={product.name}
                    className={styles.productImage}
                />
                <div className={styles.overlay}>
                    <button
                        className={styles.addToBasket}
                        onClick={handleAddToBasket} // Trigger add to cart action
                    >
                        Add to Basket
                    </button>
                </div>
            </div>
            <div className={styles.cardInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productCategory}>{product.category}</p>
                <p className={styles.productPrice}>${product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
