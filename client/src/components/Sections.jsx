import React from "react";
import "./Sections.css";
import { Link } from "react-router-dom";

const Sections = () => {
    return (
        <div className="sections">

            {/* Categories */}
            <section className="categories fade-in">
                <h2>Explore by Category</h2>
                <div className="category-cards">
                    <div className="card">🏠 Apartments</div>
                    <div className="card">🏡 Villas</div>
                    <div className="card">🏠 House</div>
                    <div className="card">🌿 Plot</div>
                    <div className="card">🏢 Commercial</div>


                </div>
            </section>

            {/* Why Choose */}
            <section className="why-choose fade-in">
                <h2>Why Choose Elite Estate?</h2>
                <ul>
                    <li>✅ Verified Listings</li>
                    <li>✅ Secure Payments</li>
                    <li>✅ 24/7 Support</li>
                    <li>✅ Expert Guidance</li>
                </ul>
            </section>

            {/* How It Works */}
            <section className="how-it-works fade-in">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">🔍 Search Properties</div>
                    <div className="step">📅 Schedule Visit</div>
                    <div className="step">🏡 Book & Move In</div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials fade-in">
                <h2>What Our Clients Say</h2>
                <div className="reviews">
                    <div className="review">
                        <p>"Elite Estate made finding my dream villa so easy!"</p>
                        <span>⭐⭐⭐⭐⭐</span>
                        <h4>- Aditi, Mumbai</h4>
                    </div>
                    <div className="review">
                        <p>"Smooth process and great support. Highly recommended."</p>
                        <span>⭐⭐⭐⭐⭐</span>
                        <h4>- Rohan, Delhi</h4>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta fade-in">
                <h2>Find Your Dream Home Today</h2>

                <Link to="/places" className="cta-btn">
                    Start Searching Now
                </Link>
            </section>

        </div>
    );
};

export default Sections;
