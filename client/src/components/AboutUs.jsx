import "./AboutUs.css";

export default function AboutUs() {
    return (
        <div className="about-container">
            <div className="left-container">
                <h1 className="about-title">About Us</h1><br />
                <p className="about-subtitle">
                    Welcome to <span className="text-highlight">Elite Estate</span>, your premier platform for discovering luxurious homes, elegant villas, and modern apartments designed for comfort and style.
                </p>
            </div>
            <div className="right-container">
                <div className="row-container">
                    <div className="cloumn-container">
                        <div className="about-section">
                            <h2>Who We Are?</h2>
                            <p>
                                At Elite Estate, we are dedicated to providing exceptional living experiences. Our platform connects homeowners with those seeking the perfect residence, ensuring a seamless journey from browsing to moving in.
                            </p>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src="/src/assets/whoweare.png" alt="Who We Are" />
                    </div>

                    <div className="image-container">
                        <img src="/src/assets/whatweoffer.png" alt="What We Offer" />
                    </div>
                    <div className="cloumn-container">
                        <div className="about-section">
                            <h2>What We Offer?</h2>
                            <ul className="about-list">
                                <li>🏡 <strong>Luxury Villas:</strong> Premium residences with state-of-the-art amenities.</li>
                                <li>🌆 <strong>Modern Apartments:</strong> Stylish and comfortable urban living spaces.</li>
                                <li>🏠 <strong>Exclusive Homes:</strong> Carefully curated properties for a perfect lifestyle.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="cloumn-container">
                        <div className="about-section">
                            <h2>Why Choose Us?</h2>
                            <div className="about-grid">
                                <p>✅ <strong>Verified Listings</strong> – Only genuine and high-quality properties.</p><br />
                                <p>✅ <strong>Seamless Booking</strong> – Easy and convenient process.</p><br />
                                <p>✅ <strong>Dedicated Support</strong> – Assistance whenever you need it.</p><br />
                                <p>✅ <strong>Best Value</strong> – Get premium properties at fair prices.</p>
                            </div>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src="/src/assets/whychooseus.webp" alt="Why Choose Us" />
                    </div>
                    <div className="image-container">
                        <img src="/src/assets/startjourney.webp" alt="Start Your Journey" />
                    </div>

                    <div className="cloumn-container">
                        <h2>Find Your Dream Home Today!</h2>
                        <p>
                            Browse our exclusive selection of properties and secure your ideal residence with <span className="text-highlight">Elite Estate</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
