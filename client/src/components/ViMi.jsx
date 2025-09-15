import React from "react";
import "./ViMi.css";
import { FaBullseye, FaEye } from "react-icons/fa";

const ViMi = () => {
    return (
        <div className="vimi-sections">
            {/* Vision & Mission Section */}
            <section className="vision-mission fade-in">
                <div className="section-header">
                    <h2>Our Vision & Mission</h2>
                    <p className="subtitle">Shaping the future of real estate with trust, innovation, and excellence</p>
                </div>

                <div className="cards-container">
                    {/* Vision Card */}
                    <div className="card">
                        <div className="icon-wrapper">
                            <FaEye className="card-icon" />
                        </div>
                        <h3>Our Vision</h3>
                        <p>
                            To redefine real estate by creating sustainable, modern,
                            and community-driven spaces where every client finds not
                            just a property, but a lifestyle of trust and excellence.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="card">
                        <div className="icon-wrapper">
                            <FaBullseye className="card-icon" />
                        </div>
                        <h3>Our Mission</h3>
                        <p>
                            To deliver world-class real estate solutions with transparency,
                            integrity, and innovation—helping individuals and families
                            build a better future through smart investments.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ViMi;
