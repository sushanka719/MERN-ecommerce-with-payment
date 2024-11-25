import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import styles from "./AllProduct.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products");

        // Update products to include full image URL
        const updatedProducts = response.data.products.map((product) => ({
          ...product,
          image: `http://localhost:4000/${product.image}`, // Add server URL to image path
        }));

        setProducts(updatedProducts || []);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, [setProducts]);

  const handleUnlist = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete(
        `http://localhost:4000/api/products/product/${id}`
      );
      console.log(response.data.success);
      if (response.data.success) {
        toast.success("Product unlisted successfully");
        setProducts(products.filter((product) => product._id !== id));
      } else {
        toast.error("Failed to unlist the product");
      }
    } catch (error) {
      toast.error("An error occurred while unlisting the product");
    }
  };

  return (
    <div className={styles.allProducts}>
      <h1>All Products</h1>
      <div className={styles.productGrid}>
        {products.length ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onUnlist={handleUnlist}
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
