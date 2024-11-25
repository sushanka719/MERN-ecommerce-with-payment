import React, { useState } from 'react';
import styles from './AddProduct.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Eyeglasses'
    });

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

    const validateForm = () => {
        let isValid = true;

        // Name validation
        if (!productData.name.trim()) {
            toast.error('Product name is required');
            isValid = false;
        }

        // Description validation
        if (!productData.description.trim()) {
            toast.error('Description cannot be empty');
            isValid = false;
        }

        // Price validation
        if (productData.price <= 0) {
            toast.error('Price must be a positive number');
            isValid = false;
        }

        // Stock validation
        if (productData.stock < 0) {
            toast.error('Stock cannot be negative');
            isValid = false;
        }

        // Image validation
        if (!image) {
            toast.error('Please upload an image');
            isValid = false;
        }

        return isValid;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // Stop form submission if validation fails
        }

        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', Number(productData.price));
        formData.append('stock', Number(productData.stock));
        formData.append('category', productData.category);
        formData.append('image', image);  // Make sure to send the image file, not the preview URL.

        try {
            const response = await axios.post("http://localhost:4000/api/products/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setProductData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    category: 'Eyeglasses',
                });
                setImage(null);
                setPreview('');
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while adding the product.');
        }
    };

    return (
        <div className={styles.addProduct}>
            <h1>Add a New Product</h1>
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
                        <option value="Contactlenses">Contact Lenses</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                <div className={styles.imageUpload}>
                    <label>Upload Product Image</label>
                    <input type="file" onChange={handleImageUpload} name='image' />
                    {preview && <img src={preview} alt="Preview" className={styles.preview} />}
                </div>

                <button type="submit" className={styles.submitButton}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
