import React, { useEffect, useState, useContext } from 'react';
import { ProductContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast} from 'react-toastify';  
import styles from './Cart.module.css';

const CartPage = () => {
  // Access cart data and deleteFromCart function from context
  const { cart, deleteFromCart, fetchCart } = useContext(ProductContext);

  const [subtotal, setSubtotal] = useState(0);
  const [productItems, setProductItems] = useState(cart);
  const initialQuantities = productItems.map(() => 1);
  const [quantities, setQuantities] = useState(initialQuantities);
  const [selectedItems, setSelectedItems] = useState(productItems.map(() => false)); // Track selected items
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Update quantity of a product
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      return;
    }

    // Check if newQuantity exceeds available stock
    const availableStock = productItems[index].stock; // Assuming stock is available in product data
    if (newQuantity > availableStock) {
      toast.error(`Not enough stock for ${productItems[index].name}. Maximum available is ${availableStock}.`);
      return;
    }

    setQuantities(
      quantities.map((qty, i) => (i === index ? newQuantity : qty))
    );
  };

  // Calculate subtotal based on selected items
  const calculateSubtotal = () => {
    return productItems.reduce((total, item, index) => {
      if (selectedItems[index]) {
        return total + item.price * quantities[index];
      }
      return total;
    }, 0);
  };

  // Remove item from cart using deleteFromCart from context
  const removeItem = (index, productId) => {
    deleteFromCart(productId);
  };

  // Toggle selection of a product
  const toggleSelectItem = (index) => {
    setSelectedItems(
      selectedItems.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  // Update subtotal whenever quantities or selected items change
  useEffect(() => {
    setSubtotal(calculateSubtotal());
  }, [quantities, productItems, selectedItems]);

  // Update product items when cart data changes in context
  useEffect(() => {
    setProductItems(cart);
    setSelectedItems(cart.map(() => false)); // Reset selection on cart update
  }, [cart]);

  // Check if any product is selected
  const isAnyProductSelected = selectedItems.some((isSelected) => isSelected);

  // Handle form validation
  useEffect(() => {
    const isFormValid = address && contactNumber && isAnyProductSelected;
    setIsFormValid(isFormValid);
  }, [address, contactNumber, isAnyProductSelected]);

  // Handle checkout button click and make API request to create the order
  const handleCheckout = async () => {
    const selectedProductIds = productItems
      .filter((_, index) => selectedItems[index]) // Get selected items based on their index
      .map((item) => item.productId); // Extract productId from the selected items

    if (!isFormValid) {
      alert("Please fill out the form completely and select items to proceed with checkout.");
      return;
    }

    // Gather data to send in the API request (e.g., address, contact number, payment method)
    const orderData = {
      selectedProducts: selectedProductIds,
      address,
      contactNumber,
      paymentMethod,
      paymentDetails,
    };

    try {
      const response = await axios.post('http://localhost:4000/api/order/create', orderData, {
        withCredentials: true, // Include cookies (for token) in the request
      });
      if (response && response.status === 200) {
        window.location.href = response.data.url;
      }
      console.log(response.data);
      fetchCart();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };
  // console.log(productItems[0].stock)

  return (
    <section className={styles.cartContainer}>
      <div className={styles.productList}>
        {productItems.map((item, index) => (
          <div key={index} className={styles.productItem}>
            <img src={item.image} alt={item.name} className={styles.productImage} />
            <div className={styles.productDetails}>
              <h3>{item.name}</h3>
              <p>Size: {item.size}</p>
              <p>Price: ${item.price}</p>
              <div className={styles.quantityControls}>
                <button onClick={() => updateQuantity(index, quantities[index] - 1)}>-</button>
                <input
                  type="number"
                  value={quantities[index]}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value, 10))}
                />
                <button onClick={() => updateQuantity(index, quantities[index] + 1)}>+</button>
              </div>
              <div className={styles.selectContainer}>
                <input
                  type="checkbox"
                  checked={selectedItems[index]}
                  onChange={() => toggleSelectItem(index)}
                />
                <label>Select</label>
              </div>
              <button
                onClick={() => removeItem(index, item.productId)} // Pass the productId to the removeItem function
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.orderSummary}>
        <h3>ORDER SUMMARY</h3>
        <div className={styles.summaryItem}>
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className={styles.summaryItem}>
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className={styles.summaryItem}>
          <p>Total</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>

        {/* Checkout Form */}
        <div className={styles.checkoutForm}>
          <h3>Shipping Information</h3>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </label>
          <label>
            Contact Number:
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your contact number"
            />
          </label>

          <label>
            Payment Method:
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="stripe">stripe</option>
            </select>
          </label>
        </div>

        <button
          className={`${styles.checkoutButton} ${!isAnyProductSelected && styles.disabledButton}`}
          disabled={!isAnyProductSelected || !isFormValid}
          onClick={handleCheckout} // Trigger the checkout handler
        >
          {isAnyProductSelected ? 'Proceed to checkout' : 'Select item to checkout'}
        </button>
      </div>
    </section>
  );
};

export default CartPage;
