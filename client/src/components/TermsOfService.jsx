import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="tos-container">
      <h1>Terms of Service</h1>
      <p>Last Updated: April 29, 2025</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Elite Estate platform, you agree to comply with and be bound by these Terms of Service. 
          If you do not agree with these terms, please discontinue use of our services.
        </p>
      </section>

      <section>
        <h2>2. Use of the Platform</h2>
        <p>
          Elite Estate provides a platform for users to list, discover, and manage real estate properties. 
          You must be at least 18 years old and ensure that all information provided during registration or transactions is accurate and complete.
        </p>
      </section>

      <section>
        <h2>3. User Responsibilities</h2>
        <ul>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Use the platform solely for lawful and intended purposes</li>
          <li>Respect the rights, privacy, and property of other users</li>
          <li>Provide truthful and accurate property details when listing</li>
        </ul>
      </section>

      <section>
        <h2>4. Listings, Bookings, and Payments</h2>
        <p>
          Property listings and transactions on Elite Estate are subject to verification and applicable fees. 
          Payment and cancellation policies vary based on the property owner or manager. 
          Users are responsible for reviewing and complying with these terms before finalizing any booking or transaction.
        </p>
      </section>

      <section>
        <h2>5. Termination of Access</h2>
        <p>
          Elite Estate reserves the right to suspend, restrict, or terminate your access to the platform at its discretion, 
          including for violations of these Terms of Service or misuse of the platform.
        </p>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>
          Elite Estate is not responsible for any damages, losses, or disputes arising from property transactions, 
          including financial losses, disputes between users, or third-party services.
        </p>
      </section>

      <section>
        <h2>7. Modifications to Terms</h2>
        <p>
          These Terms of Service may be updated periodically. 
          Any modifications will be posted here with an updated effective date. 
          Continued use of the platform signifies your acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>8. Governing Law</h2>
        <p>
          These Terms are governed by the laws of your jurisdiction. 
          Any disputes shall be resolved in the courts of the applicable region.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions regarding these Terms of Service, please contact us at: <br />
          <strong>Email:</strong> legal@eliteestate.com
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
