import express from 'express';
import { addProduct, getProducts, deleteProduct, updateProduct, getSingleProduct, addCart, getCart, deleteCartItem, searchProducts } from '../controllers/product.controller.js'; // Import the controller
import upload from '../middleware/upload.js';
const router = express.Router();

// Define the route to add a product
router.post('/add', upload.single("image"),  addProduct);
router.put('/update/:id', upload.single("image"), updateProduct);
router.get('/', getProducts);
router.delete('/product/:id', deleteProduct);
router.get('/product/:id', getSingleProduct);
router.post('/cart/add', addCart);
router.get('/cart', getCart)
router.delete('/cart/delete/:productId', deleteCartItem);
router.get('/search', searchProducts);

export default router;
