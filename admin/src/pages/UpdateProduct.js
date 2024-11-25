import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import styles from './AddProduct.module.css'; // Reusing AddProduct CSS module
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const { id } = useParams(); // Fetch the product ID from the route
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Eyeglasses',
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch product details when component loads
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/products/product/${id}`);
                const product = response.data.product;

                setProductData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                });
                setPreview(`http://localhost:4000/${product.image}`); // Set the current image as preview
            } catch (error) {
                toast.error('Failed to fetch product details');
            }
        };

        fetchProduct();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error('Please select an image!');
            return;
        }

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', Number(productData.price));
        formData.append('stock', Number(productData.stock));
        formData.append('category', productData.category);

        // Only append the image if a new one is uploaded
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/products/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('Product updated successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while updating the product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.addProduct}>
            <h1>Update Product</h1>
            <form className={styles.form} onSubmit={handleFormSubmit}>
                <div className={styles.field}>
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label>Product Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={productData.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        required
                    ></textarea>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={productData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={productData.stock}
                            onChange={handleInputChange}
                            placeholder="Enter stock amount"
                            required
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label>Category</label>
                    <select
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                    >
                        <option value="Eyeglasses">Eyeglasses</option>
                        <option value="Sunglasses">Sunglasses</option>
                        <option value="Contact Lenses">Contact Lenses</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                <div className={styles.imageUpload}>
                    <label>Upload Product Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    {preview && <img src={preview} alt="Preview" className={styles.preview} />}
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
