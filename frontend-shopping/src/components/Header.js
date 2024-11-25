import React from 'react';
import './Header.css';
import banner from '../assets/banner.jpg';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="header-banner">
                <img
                    src={banner}
                    alt="Glasses Banner"
                    className="banner-image"
                />
                <div className="banner-text">
                    <h1 className="banner-heading">Your Perfect Vision</h1>
                    <p className="banner-description">
                        Discover a world of style and clarity with our premium eyewear collection.
                    </p>
                    <Link to="/shop">
                        <button className="shop-now-button">Shop Now</button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
