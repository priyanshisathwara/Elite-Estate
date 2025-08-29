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
          Welcome to Elite Estate. We value your trust and are committed to protecting your personal 
          information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard 
          your information when you use our platform.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We may collect personal information such as:</p>
        <ul>
          <li>Your name, email address, and phone number</li>
          <li>Property details you provide when listing</li>
          <li>Payment and billing information for transactions</li>
          <li>Activity on the platform, such as inquiries and bookings</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use the information to:</p>
        <ul>
          <li>Enable property listings, inquiries, and transactions</li>
          <li>Communicate with property owners and clients</li>
          <li>Improve security, functionality, and user experience</li>
          <li>Comply with applicable legal and regulatory requirements</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>
          We do not sell or rent your personal data. However, we may share it with trusted third-party 
          service providers (such as payment processors or hosting providers) or if required by law.
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your information 
          from unauthorized access, misuse, or disclosure.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, correct, or request deletion of your personal information. 
          You may also choose to opt-out of receiving promotional communications at any time.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any updates will be posted on this page, 
          along with the revised effective date.
        </p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at: <br />
          <strong>Email:</strong> legal@eliteestate.co.in <br />
          <strong>Phone:</strong> +91 98765 43210 <br />
          <strong>Address:</strong> Elite Estate Pvt. Ltd., 21 Sunrise Business Park, MG Road, Ahmedabad, Gujarat – 380015
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
