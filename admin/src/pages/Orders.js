import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/admin/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle delivery status change
  const handleDeliveryStatusChange = async (orderId, newStatus) => {
    console.log('Updating order:', orderId, 'to status:', newStatus);
    try {
      setUpdatingStatus(orderId);

      const response = await axios.patch(
        `http://localhost:4000/api/admin/orders/${orderId}/status`,
        { deliveryStatus: newStatus }, // Ensure this matches the backend requirement
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        // Update the order locally in the UI
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, deliveryStatus: newStatus }
              : order
          )
        );
        toast.success('Order status updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order status:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Delete order handler
  const handleDeleteOrder = async (orderId) => {
    console.log(orderId)
    try {
      const confirmDeletion = window.confirm('Are you sure you want to delete this order?');
      if (!confirmDeletion) return;

      const response = await axios.delete(`http://localhost:4000/api/order/${orderId}`, {
        withCredentials: true, // Include credentials (e.g., cookies)
      });

      if (response.status === 200 && response.data.success) {
        // Remove the order from the local state
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        toast.success('Order deleted successfully');
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Something went wrong while deleting the order');
    }
  };

  return (
    <div className={styles.ordersPage}>
      <h1>Orders</h1>
      <div className={styles.ordersContainer}>
        {orders.length === 0 ? (
          <p className={styles.noOrders}>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className={styles.orderBox}>
              <div className={styles.orderHeader}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteOrder(order._id)} // Delete button
                >
                  Delete Order
                </button>
                <h3>Order ID: {order._id}</h3>
                <p>Contact: {order.contactNumber}</p>
                <p>Address: {order.address}</p>
                <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div className={styles.orderContent}>
                {order.orderItems.map((item) => (
                  <div key={item._id} className={styles.productItem}>
                    <img
                      src={`http://localhost:4000/${item.productId.image}`}
                      alt={item.productId.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                      <h4>{item.productId.name}</h4>
                      <p>{item.productId.description}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price.toFixed(2)}</p>
                      <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.totalAmount}>
                  <strong>Total Amount: ₹{order.totalAmount.toFixed(2)}</strong>
                </div>

                <div className={styles.statusUpdate}>
                  <label htmlFor={`status-${order._id}`}>Delivery Status:</label>
                  <select
                    id={`status-${order._id}`}
                    value={order.deliveryStatus}
                    onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                    className={styles.statusDropdown}
                    disabled={updatingStatus === order._id}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Packed">Packed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className={styles.paymentStatus}>
                  <strong>Payment Status:</strong>{' '}
                  <span className={`${styles.paymentBadge} ${styles[order.paymentStatus.toLowerCase()]}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
