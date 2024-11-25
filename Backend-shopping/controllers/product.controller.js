import {Product} from '../models/product.model.js'; // Assuming you have a Product model
import path from 'path';
import fs from 'fs';
import {User} from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


export const addProduct = async (req, res) => {
    try {
        // Check if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Create a new product object with form fields (product name, price, etc.) and the image path
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: path.join('uploads', req.file.filename),
            category: req.body.category,
            stock: req.body.stock
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({ success: true, message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false,  message: "Something went wrong" });
    }
};


export const getProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        if (!products.length) {
            return res.status(404).json({ success: true ,message: "No products found" });
        }

        // Return the fetched products
        res.status(200).json({ success: true, message: "Products retrieved successfully", products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


// Delete Product Controller
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Remove the image file from the server
        const imagePath = product.image;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Deletes the image file
        }

        // Delete the product from the database
        await Product.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


export const updateProduct = async (req, res) => {
    const { id } = req.params; // Get product ID from URL params
    const { name, description, price, category, stock } = req.body; // Get product details from request body

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // If a new image is uploaded, replace the old one
        if (req.file) {
            const newImagePath = path.join('uploads', req.file.filename);

            // Remove the old image file
            const oldImagePath = product.image;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Deletes the old image file
            }

            // Update the product image path
            product.image = newImagePath;
        }

        // Update the other product fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock) product.stock = stock;

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export const getSingleProduct = async (req, res) => {
    const { id } = req.params; // Extract product ID from URL params

    try {
        // Find the product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            product,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// Controller to add item to cart
export const addCart = async (req, res) => {
    const { productId, quantity, price } = req.body;
    console.log(productId)

    // Extract the token from cookies
    const token = req.cookies.token; // Assuming your token is stored in cookies with name 'token'

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find if the product is already in the cart
        const existingItem = user.cart.find((item) => item.productId.toString() === productId);

        // Update or add the item to the cart
        if (existingItem) {
            existingItem.quantity += quantity; // Increase quantity if already in cart
        } else {
            user.cart.push({ productId, quantity, price }); // Add new product to the cart
        }

        // Save the updated user cart
        await user.save();

        // Return success response with updated cart
        res.status(200).json({ message: "Item added to cart", cart: user.cart });
    } catch (error) {
        console.error("Error in addCart:", error);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// Controller to get a user's cart items
export const getCart = async (req, res) => {
    // Extract the token from cookies
    const token = req.cookies.token; // Assuming your token is stored in cookies with name 'token'

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user by ID and populate cart with product details
        const user = await User.findById(userId).populate("cart.productId", "name image price");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user's cart with product details
        res.status(200).json({
            message: "Cart retrieved successfully",
            cart: user.cart.map((item) => ({
                productId: item.productId._id,
                name: item.productId.name,
                image: item.productId.image,
                price: item.productId.price,
                quantity: item.quantity,
                // stock: item.productId.stock,
                total: item.quantity * item.productId.price, // Calculate total price for this item
            })),
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Failed to retrieve cart" });
    }
};

export const deleteCartItem = async (req, res) => {
    const { productId } = req.params; // Get productId from URL parameter

    // Extract the token from cookies
    const token = req.cookies.token; // Assuming your token is stored in cookies with name 'token'

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid productId format" });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the product in the user's cart
        const itemIndex = user.cart.findIndex((item) => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        // Remove the product from the cart
        user.cart.splice(itemIndex, 1);

        // Save the updated user cart
        await user.save();

        // Return success response with updated cart
        res.status(200).json({ message: "Item removed from cart", cart: user.cart });
    } catch (error) {
        console.error("Error in deleteCartItem:", error);
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
};

// Search products by name or description, return only IDs
export const searchProducts = async (req, res) => {
    const { query } = req.query;  // Get the search query from URL

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        // Find products where the name or description matches the query (case-insensitive)
        const matchingProducts = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).select('_id name description');  // Return only _id, name, and description

        // Return the matching product IDs and basic details
        res.json(matchingProducts);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};
