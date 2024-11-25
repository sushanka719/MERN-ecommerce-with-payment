// src/components/SidePanel.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SidePanel.module.css';

const SidePanel = () => {
    return (
        <div className={styles.sidePanel}>
            <ul className={styles.navList}>
                <li>
                    <Link to="/admin/add" className={styles.navItem}>Add Item</Link>
                </li>
                <li>
                    <Link to="/admin/products" className={styles.navItem}>All Products</Link>
                </li>
                <li>
                    <Link to="/admin/orders" className={styles.navItem}>Orders</Link>
                </li>
                <li>
                    <Link to="http://localhost:3000/" className={styles.navItem}>Back to Website</Link>
                </li>
            </ul>
        </div>
    );
};

export default SidePanel;
