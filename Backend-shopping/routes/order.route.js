import express from 'express';
import { createOrder, getOrders, getAdminOrders, updateOrderStatus, adminDeleteOrder } from '../controllers/order.controller.js';


const router = express.Router();

// Create a new order route
router.post('/order/create', createOrder);
router.get('/orders', getOrders);
router.get('/admin/orders', getAdminOrders)
router.patch('/admin/orders/:orderId/status', updateOrderStatus)
router.delete('/order/:orderId', adminDeleteOrder);

export default router;
