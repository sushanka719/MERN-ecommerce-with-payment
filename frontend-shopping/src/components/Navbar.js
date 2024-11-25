import React, { useState, useRef, useEffect, useContext } from 'react';
import './Navbar.css';
import cartIcon from '../assets/shopping-cart.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authStore'; // Assuming you have this context
import { ProductContext } from '../Context/StoreContext'; // Import the cart context
const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State to store search query
    const dropdownRef = useRef(null); // Ref for the dropdown menu
    const { isAuthenticated, user, logout } = useAuth(); // Assuming `useAuth` provides `logout`
    const { cart } = useContext(ProductContext); // Access cart data from context
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0); // Calculate total items in cart
    const navigate = useNavigate(); // Use navigate hook to redirect

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home after logout
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSearch = () => {
        // Redirect to /shop with the search query as a URL parameter
        if (searchQuery) {
            navigate(`/shop?search=${searchQuery}`);
        }
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

   return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>SakiraVision</h2>
            </div>

            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>

            <div className="navbar-actions">
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" onClick={handleSearch}>Search</button>
                </div>

                <div className="navbar-cart">
                    <Link to="/cart">
                        <img src={cartIcon} alt="Cart" className="cart-icon" />
                        {cartItemCount > 0 && (
                            <span className="cart-counter">{cartItemCount}</span>
                        )}
                    </Link>
                </div>
            </div>

            <div className="navbar-auth">
                {isAuthenticated && user?.isVerified ? (
                    <div className="navbar-dropdown" ref={dropdownRef}>
                        <button
                            className="navbar-dropdown-btn"
                            onClick={handleDropdownToggle}
                        >
                            {user?.name} <span>&#9662;</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="navbar-dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/orders" className="dropdown-item">Orders</Link>
                                <Link to="/Dashboard" className="dropdown-item">Create store</Link>
                                <button onClick={handleLogout} className="dropdown-item">Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login"><button className="navbar-login">Login</button></Link>
                        <Link to="/signup"><button className="navbar-signup">Sign Up</button></Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;