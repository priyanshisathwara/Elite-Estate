import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import footerImage from '/src/assets/footer.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Left Section - Details */}
          <div className="footer-details">
            <h2>Elite Estate GROUP</h2>

            {/* Columns container */}
            <div className="footer-details-horizontal">
              <div className="footer-column">
                <h4>Contact Us</h4>
                <p>Elite Estate Pvt. Ltd.<br />21, Sunrise Business Park, <br /> MG Road, Ahmedabad, Gujarat – 380015, India</p>
                <p>+91 98765 43210</p>
                <p>Email: legal@eliteestate.com</p>
              </div>

              <div className="footer-column">
                <h4>Office Hours</h4>
                <p>Monday to Friday: 9:00 am to 6:00 pm</p>
                <p>Saturday: 9:00 am to 12 noon</p>
                <p>Sunday: by appointment only</p>
              </div>
            </div>

            {/* Social Media Links */}
            <h4 className="footer-social-heading">Get Social</h4>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
            </div>

            <div className="footer-links">
              <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
              <a href="/terms-of-service" className="footer-link">Terms & Conditions</a>
              <a href="/contact-us" className="footer-link">Contact Us</a>

            </div>

          </div>
        </div>
      </div>

      {/* Copyright Info */}
      <div className="footer-copy">
        <p>&copy; {new Date().getFullYear()} Elite Estate. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
