import React from "react";
import "./Sections.css";
import { FaHandshake, FaBuilding, FaUsers, FaShieldAlt } from "react-icons/fa";

const Sections = () => {
  return (
    <div className="sections fade-in">
      {/* Intro */}
      <section className="intro">
        <h2>Elite Estate – Redefining the Art of Living</h2>
        <p>
          At Elite Estate, we don’t just sell properties—we help you discover
          spaces that reflect your lifestyle, ambitions, and dreams. With years
          of expertise, we blend innovation, trust, and quality to redefine
          modern real estate for our valued clients.
        </p>
      </section>

      {/* What We Offer */}
      <section className="offers">
        <h3>What We Offer</h3>
        <div className="offers-grid">
          <div className="offer-card">
            <FaBuilding className="offer-icon" />
            <h4>Premium Properties</h4>
            <p>
              Handpicked residential and commercial spaces that define elegance,
              comfort, and value.
            </p>
          </div>

          <div className="offer-card">
            <FaHandshake className="offer-icon" />
            <h4>Trusted Partnerships</h4>
            <p>
              Transparent dealings and long-term relationships built on trust
              and reliability.
            </p>
          </div>

          <div className="offer-card">
            <FaUsers className="offer-icon" />
            <h4>Client-Centric Approach</h4>
            <p>
              Tailored real estate solutions designed around your needs and
              aspirations.
            </p>
          </div>

          <div className="offer-card">
            <FaShieldAlt className="offer-icon" />
            <h4>Safe Investments</h4>
            <p>
              Secure, future-ready projects that ensure your investments grow
              with confidence.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Sections;
