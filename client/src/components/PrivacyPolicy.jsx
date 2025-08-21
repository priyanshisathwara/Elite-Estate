import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>Effective Date: April 29, 2025</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to our Vacation Rental App. We are committed to protecting your personal information
          and your right to privacy. This Privacy Policy describes how we collect, use, and safeguard your data.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We collect personal information such as:</p>
        <ul>
          <li>Your name and contact details</li>
          <li>Payment and billing information</li>
          <li>Booking and rental activity</li>
          <li>Location data (if enabled)</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the information to:</p>
        <ul>
          <li>Facilitate bookings and rentals</li>
          <li>Communicate with users and hosts</li>
          <li>Enhance platform security and user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>
          We do not sell or rent your personal data. However, we may share it with third-party services 
          necessary for payment processing, hosting, or legal compliance.
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your information from unauthorized access, 
          disclosure, alteration, or destruction.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information. You may also opt-out of 
          marketing emails at any time.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this policy occasionally. Any changes will be posted on this page with the updated effective date.
        </p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at: <br />
          <strong>Email:</strong> support@vacationrentalapp.com
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
