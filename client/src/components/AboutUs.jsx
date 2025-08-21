import "./AboutUs.css";

export default function AboutUs() {
    return (
        <div className="about-container">
            <div className="left-container">
                <h1 className="about-title">About Us</h1><br />
                <p className="about-subtitle">
                    Welcome to <span className="text-highlight">Vacation Rental</span>, your trusted platform for finding luxurious villas, cozy farmhouses, and modern apartments for rent.
                </p>
            </div>
            <div className="right-container">
                <div className="row-container">
                    <div className="cloumn-container">
                        <div className="about-section">
                            <h2>Who We Are?</h2>
                            <p>
                                At Vacation Rental, we believe in creating memorable travel experiences. Our platform connects property owners with travelers, ensuring a seamless booking experience.
                            </p>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src="/src/assets/whoweare.avif" alt="img1" />
                    </div>

                    <div className="image-container">
                        <img src="/src/assets/whatweoffer.jpeg" alt="img1" />
                    </div>
                    <div className="cloumn-container">
                        <div className="about-section">
                            <h2>What We Offer?</h2>
                            <ul className="about-list">
                                <li>🏝 <strong>Luxurious Villas:</strong> Enjoy breathtaking views and top-notch amenities.</li>
                                <li>🌿 <strong>Farmhouses:</strong> Escape the city and relax in nature.</li>
                                <li>🏙 <strong>Apartments:</strong> Stay in modern and well-equipped spaces.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="cloumn-container">
                        <div className="about-section">
                            <h2>Why Choose Us?</h2>
                            <div className="about-grid">
                                <p>✅ <strong>Verified Listings</strong> – High-quality, safe properties.</p><br />
                                <p>✅ <strong>Easy Booking</strong> – A seamless process.</p><br />
                                <p>✅ <strong>24/7 Customer Support</strong> – Help when you need it.</p><br />
                                <p>✅ <strong>Best Price Guarantee</strong> – Get the best deals.</p>
                            </div>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src="/src/assets/whychooseus.webp" alt="img1" />
                    </div>
                    <div className="image-container">
                        <img src="/src/assets/startjourney.avif" alt="img1" />
                    </div>

                    <div className="cloumn-container">
                        <h2>Start Your Journey Today!</h2>
                        <p>
                            Explore our curated selection and book your dream stay with <span className="text-highlight">Vacation Rental</span>.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
