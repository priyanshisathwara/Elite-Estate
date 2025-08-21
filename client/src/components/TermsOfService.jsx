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
          By accessing or using our Vacation Rental App, you agree to comply with and be bound by these Terms of Service.
          If you do not agree with these terms, please do not use the application.
        </p>
      </section>

      <section>
        <h2>2. Use of the Platform</h2>
        <p>
          Our platform allows users to list, discover, and book vacation properties. You must be at least 18 years old
          and provide accurate, complete information when registering or making bookings.
        </p>
      </section>

      <section>
        <h2>3. User Responsibilities</h2>
        <ul>
          <li>Keep your account credentials secure</li>
          <li>Use the platform only for lawful purposes</li>
          <li>Respect the rights and property of others</li>
        </ul>
      </section>

      <section>
        <h2>4. Booking and Payments</h2>
        <p>
          Bookings are confirmed once payment is processed. Cancellation policies may vary depending on the host's
          preferences. Always review the terms before booking.
        </p>
      </section>

      <section>
        <h2>5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the platform at any time, for any reason,
          including breach of these terms.
        </p>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>
          We are not liable for any direct, indirect, or incidental damages arising out of your use of the platform,
          including lost profits or data.
        </p>
      </section>

      <section>
        <h2>7. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. Changes will be posted here with an updated date. Continued use of the
          platform means you accept the updated terms.
        </p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at: <br />
          <strong>Email:</strong> legal@vacationrentalapp.com
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
