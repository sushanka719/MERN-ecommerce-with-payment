import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.companyInfo}>
                    <p className={styles.footerName}>sakira vision</p>
                    <p className={styles.footerEmail}>sushanka@example.com</p>
                </div>

                <div className={styles.footerLinks}>
                    <h4 className={styles.footerTitle}>Quick Links</h4>
                    <ul className={styles.linksList}>
                        <li><a href="/shop" className={styles.footerLink}>Shop</a></li>
                        <li><a href="/about" className={styles.footerLink}>About Us</a></li>
                        <li><a href="/contact" className={styles.footerLink}>Contact</a></li>
                        <li><a href="/privacy" className={styles.footerLink}>Privacy Policy</a></li>
                    </ul>
                </div>

                <div className={styles.footerSocialLinks}>
                    <h4 className={styles.footerTitle}>Follow Us</h4>
                    <div className={styles.socialLinks}>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Twitter</a>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p className={styles.footerCopyright}>
                    © {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
