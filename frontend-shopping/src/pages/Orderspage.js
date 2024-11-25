import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrdersPage.module.css";
import { toast } from "react-toastify";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from the backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/orders", { withCredentials: true });
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading your orders...</div>;
    }

    return (
        <div className={styles.ordersPage}>
            <div className={styles.pageTitle}>Your Orders</div>
            {orders.length === 0 ? (
                <p className={styles.noOrders}>You have no orders yet.</p>
            ) : (
                <div className={styles.ordersContainer}>
                    {orders.map((order, index) => (
                        <div key={order._id} className={styles.orderBox}>
                            <div className={styles.orderHeader}>Order #{index + 1}</div>
                            <div className={styles.orderDetails}>
                                <div className={styles.orderDetail}>
                                    Total Amount: ${order.totalAmount}
                                </div>
                                <div className={styles.orderDetail}>
                                    Payment Method: {order.paymentMethod}
                                </div>
                                <div className={styles.orderDetail}>
                                    Payment Status: {order.paymentStatus}
                                </div>
                                <div className={styles.orderDetail}>
                                    Delivery Status: {order.deliveryStatus}
                                </div>
                                <div className={styles.orderDetail}>
                                    Ordered Date: {new Date(order.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div className={styles.itemDetails}>
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className={styles.itemRow}>
                                        <span>{item.productId.name}</span>
                                        <span>Price: ${item.price}</span>
                                        <span>Quantity: {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
