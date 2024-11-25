import React from 'react';
import styles from './ContactUs.module.css';

const ContactUs = () => {
    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <h1 className={styles.title}>Contact Us</h1>
                <div className={styles.cardsContainer}>
                    <div className={styles.card}>
                        <h2>Our Office</h2>
                        <p>123 Vision Avenue</p>
                        <p>Imaginary City, Wonderland 56789</p>
                    </div>
                    <div className={styles.card}>
                        <h2>Contact Details</h2>
                        <p>📞 Phone: +1 (234) 567-890</p>
                        <p>📧 Email: support@xyz.com</p>
                    </div>
                    <div className={styles.card}>
                        <h2>Opening Hours</h2>
                        <p>🕒 Monday - Friday: 9 AM - 5 PM</p>
                        <p>🕒 Saturday: 10 AM - 3 PM</p>
                        <p>🕒 Sunday: Closed</p>
                    </div>
                    <div className={styles.card}>
                        <h2>Find Us</h2>
                        <iframe
                            title="office-location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509087!2d144.96305791531694!3d-37.81410797975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577f6e23e5c3cb1!2s123%20Vision%20Ave%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sau!4v1682117369052!5m2!1sen!2sau"
                            className={styles.map}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
