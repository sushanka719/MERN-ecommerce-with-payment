import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ExploreMenu.css';
import contact from '../assets/contacts.jpeg';
import sunGlasses from '../assets/sunglasses.jpeg';
import normal from '../assets/normal.jpeg';
import acces from '../assets/acces.jpg';

const glassesData = [
    { id: 1, name: 'Eyeglasses', image: normal },
    { id: 2, name: 'Sunglasses', image: sunGlasses },
    { id: 3, name: 'Contactlenses', image: contact },
    { id: 4, name: 'Accessories', image: acces },
];

const ExploreMenu = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    // Handle card click
    const handleCardClick = (categoryName) => {
        // Navigate to the shop component for the specific category
        navigate(`/shop/${categoryName.toLowerCase()}`);
    };

    return (
        <section className="explore-menu">
            <h2>Explore Our Collection</h2>
            <div className="glasses-grid">
                {glassesData.map(glass => (
                    <div
                        key={glass.id}
                        className="glass-card"
                        onClick={() => handleCardClick(glass.name)}
                    >
                        <img src={glass.image} alt={glass.name} className="glass-image" />
                        <div className="glass-info">
                            <h3>{glass.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ExploreMenu;
