import React from 'react';
import styles from './AboutUs.module.css';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className={styles.aboutUsContainer}>
            <div className={styles.banner}>
                <div className={styles.overlay}></div>
                <div className={styles.textWrapper}>
                    <h1 className={styles.title}>Hips don’t lie, so do your glasses!</h1>
                    <section className={styles.content}>
                        <h2>Your Vision, Our Mission</h2>
                        <p>
                            At SakiraVision, we’re all about helping you find your perfect vision—both in sight and style.
                            With our unique and premium eyewear, you'll see the world clearly and look fabulous while doing it!
                        </p>
                        <Link to='/shop'>
                            <button className={styles.shopNowButton}>Shop Now</button>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
