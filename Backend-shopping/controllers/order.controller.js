import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import stripePackage from 'stripe';
import { Product } from '../models/product.model.js';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Stripe webhook handling endpoint
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            await createOrderAfterPayment(session);
        } catch (err) {
            console.error('Error creating order after payment:', err);
            return res.status(500).json({ error: 'Failed to create order after payment' });
        }
    }

    res.json({ received: true });
};

// Modified createOrder controller
const createOrder = async (req, res) => {
    const { address, contactNumber, paymentMethod, selectedProducts } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!selectedProducts || selectedProducts.length === 0) {
            return res.status(400).json({ error: "No products selected for the order" });
        }

        const selectedCartItems = [];
        let totalAmount = 0;

        // Validate products and calculate total
        for (let productId of selectedProducts) {
            const productInCart = user.cart.find((item) => item.productId.toString() === productId);
            if (!productInCart) {
                return res.status(400).json({ error: `Product with ID ${productId} is not in your cart` });
            }

            const productDetails = await Product.findById(productId);
            if (!productDetails) {
                return res.status(404).json({ error: `Product with ID ${productId} not found` });
            }

            selectedCartItems.push({
                productId: productDetails._id,
                quantity: productInCart.quantity,
                price: productDetails.price,
            });

            totalAmount += productDetails.price * productInCart.quantity;
        }

        // Handle different payment methods
        if (paymentMethod === "stripe") {
            try {
                const lineItems = selectedCartItems.map((item) => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Product: ${item.productId}`,
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                }));

                // Store order details in the session metadata
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${process.env.FRONTEND_URL}/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
                    customer_email: user.email,
                    metadata: {
                        userId: userId.toString(),
                        address,
                        contactNumber,
                        selectedProducts: JSON.stringify(selectedProducts)
                    }
                });

                return res.status(200).json({ url: session.url });
            } catch (error) {
                console.error("Error creating Stripe Checkout session:", error);
                return res.status(500).json({ error: "Stripe Checkout session creation failed" });
            }
        } else {
            // Handle other payment methods (COD, etc.)
            const order = {
                orderItems: selectedCartItems,
                totalAmount,
                paymentStatus: "Pending",
                paymentMethod,
                address,
                contactNumber,
                deliveryStatus: "Pending",
            };

            user.orders.push(order);
            user.cart = user.cart.filter((item) => !selectedProducts.includes(item.productId.toString()));
            await user.save();

            return res.status(201).json({
                message: "Order created successfully",
                order,
            });
        }
    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

// Helper function to create order after successful payment
const createOrderAfterPayment = async (session) => {
    const {
        userId,
        address,
        contactNumber,
        selectedProducts
    } = session.metadata;

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const productIds = JSON.parse(selectedProducts);
    const orderItems = [];
    let totalAmount = 0;

    // Recreate order items from stored products
    for (let productId of productIds) {
        const productDetails = await Product.findById(productId);
        const productInCart = user.cart.find((item) => item.productId.toString() === productId);

        if (productDetails && productInCart) {
            orderItems.push({
                productId: productDetails._id,
                quantity: productInCart.quantity,
                price: productDetails.price,
            });
            totalAmount += productDetails.price * productInCart.quantity;
        }
    }

    // Create the order after successful payment
    const order = {
        orderItems,
        totalAmount,
        paymentStatus: "Paid",
        paymentMethod: "stripe",
        paymentDetails: {
            sessionId: session.id,
            paymentIntentId: session.payment_intent
        },
        address,
        contactNumber,
        deliveryStatus: "Pending",
    };

    user.orders.push(order);
    user.cart = user.cart.filter((item) => !productIds.includes(item.productId.toString()));
    await user.save();

    return order;
};

export { createOrder, stripeWebhook };

export const getOrders = async (req, res) => {
    const token = req.cookies.token; // Extract token from cookies

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user by userId and populate their orders
        const user = await User.findById(userId).populate('orders.orderItems.productId'); // Populating order items with product details

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user has any orders
        if (!user.orders || user.orders.length === 0) {
            return res.status(200).json({ message: "No orders found" });
        }

        // Return the user's orders
        res.status(200).json({
            message: "Orders fetched successfully",
            orders: user.orders,
        });
    } catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

export const getAdminOrders = async (req, res) => {
    try {
        // Find all users and populate their orders with product details
        const users = await User.find({})
            .populate({
                path: 'orders.orderItems.productId',
                select: 'name description price category image' // Select the fields you want to include
            });

        // Extract and flatten all orders from all users
        let allOrders = [];
        users.forEach(user => {
            if (user.orders && user.orders.length > 0) {
                // Add user information to each order
                const ordersWithUserInfo = user.orders.map(order => ({
                    ...order.toObject(),
                    userInfo: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                }));
                allOrders = [...allOrders, ...ordersWithUserInfo];
            }
        });

        // Sort orders by date (most recent first)
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (allOrders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders found",
                orders: []
            });
        }

        // Return all orders
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders: allOrders,
            totalOrders: allOrders.length,
            totalAmount: allOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        });

    } catch (error) {
        console.error("Error in getAdminOrders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryStatus } = req.body;  // Changed from status to deliveryStatus

        if (!orderId || !deliveryStatus) {
            return res.status(400).json({
                success: false,
                message: "Order ID and delivery status are required"
            });
        }

        // Validate status values
        const validStatuses = ['Pending', 'Packed', 'Dispatched', 'Delivered'];
        if (!validStatuses.includes(deliveryStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery status"
            });
        }

        // Find and update the user's order
        const user = await User.findOne({ 'orders._id': orderId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const orderIndex = user.orders.findIndex(
            order => order._id.toString() === orderId
        );

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Update the status
        user.orders[orderIndex].deliveryStatus = deliveryStatus;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: user.orders[orderIndex]
        });

    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};
export const adminDeleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const cleanedOrderId = orderId.trim(); // Clean the input

        // Validate the cleaned order ID
        if (!mongoose.Types.ObjectId.isValid(cleanedOrderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID format"
            });
        }

        // Find the user with the specific order
        const user = await User.findOne({ 'orders._id': cleanedOrderId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Remove the order from the user's orders array
        user.orders = user.orders.filter(order => order._id.toString() !== cleanedOrderId);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Error in adminDeleteOrder:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order",
            error: error.message
        });
    }
};
