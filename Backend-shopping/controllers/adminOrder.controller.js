import { Admin } from '../models/user.model';

export const getAdminOrders = async (req, res) => {
    try {
        // Fetch the admin data and populate orders with product details
        const admin = await Admin.findOne().populate('orders.orderItems.productId');

        if (!admin || !admin.orders || admin.orders.length === 0) {
            return res.status(200).json({ message: "No orders found" });
        }

        // Return all orders
        res.status(200).json({
            message: "Orders fetched successfully",
            orders: admin.orders,
        });
    } catch (error) {
        console.error("Error in getAdminOrders:", error);
        res.status(500).json({ error: "Failed to fetch admin orders" });
    }
};
