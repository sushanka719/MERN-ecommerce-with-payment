import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../Context/StoreContext";
import styles from "./ProductDetail.module.css";
import { useAuth } from '../Context/authStore';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(ProductContext);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
    });
    const [preview, setPreview] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/products/product/${id}`);
                const product = response.data.product;

                setProductData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                });

                setPreview(`http://localhost:4000/${product.image}`);
                setLoading(false);
            } catch (err) {
                toast.error('Failed to fetch product details');
                setError(err);
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    const handleQuantityChange = (action) => {
        if (action === "increment") {
            if (quantity < productData.stock) {
                setQuantity(quantity + 1);
            } else {
                toast.error("Not enough stock available!");
            }
        } else if (action === "decrement" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleBackToShop = () => {
        navigate("/shop");
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error('Please log in to add items to the cart!');
        } else if (productData.stock === "0") {
            toast.error("no stocks available")
        } else if (quantity > productData.stock) {
            toast.error('Not enough stock available!');
        } else {
            addToCart(id, quantity, productData.price);
            toast.success('Item added to cart!');
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error.message}</div>;

    return (
        <section className={styles.container}>
            <div className={styles.productCard}>
                {/* Image gallery */}
                <div className={styles.imageGalleryContainer}>
                    <img
                        src={preview}
                        alt={productData.name}
                        className={styles.mainImage}
                    />
                </div>

                {/* Product details */}
                <div className={styles.productInfoContainer}>
                    <h2 className={styles.productTitle}>{productData.name}</h2>
                    <p className={styles.productCategory}>
                        <strong>Category: </strong>{productData.category}
                    </p>
                    <p className={styles.productPrice}>
                        <strong>Price: </strong>${productData.price}
                    </p>
                    <p className={styles.productStock}>
                        <strong>Stock: </strong>{productData.stock === 0 ? "no stocks available" : `${productData.stock} available`}
                    </p>
                    <p className={styles.productDescription}>{productData.description}</p>

                    {/* Quantity selector */}
                    <div className={styles.quantitySelector}>
                        <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange("decrement")}
                        >
                            −
                        </button>
                        <div className={styles.quantityDisplay}>{quantity}</div>
                        <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange("increment")}
                        >
                            +
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.addToCart}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Back to Shop Button */}
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.backToShop}
                            onClick={handleBackToShop}
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
