import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    font-family: 'Source Sans 3', sans-serif;
    background: #fff;
    color: #444;
    min-height: 100vh;
    padding-top: 50px;
  }

  .pp-container {
    max-width: 1020px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  /* Title */
  .pp-title {
    font-family: 'Merriweather', serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    color: #1a3a6b;
    line-height: 1.15;
    padding-bottom: 20px;
    border-bottom: 3px solid #1a3a6b;
    margin-bottom: 32px;
  }

  /* Intro paragraph */
  .pp-intro {
    font-size: 16px;
    line-height: 1.7;
    color: #333;
    margin-bottom: 40px;
  }
  .pp-intro strong { color: #111; }

  /* Section heading (h2 with blue left bar) */
  .pp-section {
    margin-bottom: 36px;
  }

  .pp-section-title {
    display: flex;
    align-items: center;
    gap: 14px;
    font-family: 'Merriweather', serif;
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 700;
    color: #1a3a6b;
    margin-bottom: 18px;
  }

  .pp-section-title::before {
    content: '';
    display: block;
    width: 5px;
    min-width: 5px;
    height: 1.3em;
    background: #1a3a6b;
    border-radius: 2px;
  }

  /* Sub-headings (h3, uppercase blue) */
  .pp-sub-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #1a3a6b;
    text-transform: uppercase;
    margin: 20px 0 10px;
  }

  /* Body paragraphs */
  .pp-body {
    font-size: 15.5px;
    line-height: 1.72;
    color: #555;
    margin-bottom: 12px;
  }
  .pp-body strong { color: #333; font-weight: 600; }

  /* Highlight box */
  .pp-highlight {
    background: #f0f4fa;
    border-left: 4px solid #1a3a6b;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 15px;
    color: #333;
    line-height: 1.65;
  }

  /* Contact info block */
  .pp-contact-info {
    margin: 12px 0 20px;
    font-size: 15.5px;
    line-height: 2;
    color: #444;
  }
  .pp-contact-info strong { color: #222; }

  /* Numbered list */
  .pp-numbered-list {
    padding-left: 22px;
    margin: 12px 0 20px;
    list-style: decimal;
  }
  .pp-numbered-list li {
    font-size: 15.5px;
    line-height: 1.72;
    color: #555;
    margin-bottom: 6px;
    padding-left: 4px;
  }
  .pp-numbered-list li strong { color: #333; }

  /* Bullet list */
  .pp-bullet-list {
    padding-left: 22px;
    margin: 10px 0 16px;
    list-style: disc;
  }
  .pp-bullet-list li {
    font-size: 15.5px;
    line-height: 1.72;
    color: #555;
    margin-bottom: 4px;
    padding-left: 4px;
  }

  /* Rights list (bold keyword) */
  .pp-rights-list {
    padding-left: 22px;
    margin: 10px 0 16px;
    list-style: disc;
  }
  .pp-rights-list li {
    font-size: 15.5px;
    line-height: 1.72;
    color: #555;
    margin-bottom: 10px;
    padding-left: 4px;
  }
  .pp-rights-list li strong { color: #222; }

  /* Data table */
  .pp-table-wrap {
    overflow-x: auto;
    margin: 20px 0 28px;
    border-radius: 4px;
    box-shadow: 0 0 0 1px #dce4f0;
  }
  .pp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
  }
  .pp-table thead tr {
    background: #1a3a6b;
    color: #fff;
  }
  .pp-table thead th {
    padding: 14px 18px;
    text-align: left;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.2px;
  }
  .pp-table tbody tr {
    border-bottom: 1px solid #e2e9f4;
  }
  .pp-table tbody tr:last-child {
    border-bottom: none;
  }
  .pp-table tbody td {
    padding: 14px 18px;
    color: #444;
    vertical-align: top;
    line-height: 1.55;
  }
  .pp-table tbody tr:nth-child(even) td {
    background: #f9fbfe;
  }

  /* Inline note */
  .pp-note {
    font-size: 15px;
    line-height: 1.65;
    color: #444;
    margin-bottom: 10px;
  }
  .pp-note strong { color: #222; }

  /* Last updated */
  .pp-last-updated {
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid #dce4f0;
    font-size: 13px;
    color: #888;
  }

  /* Glossary terms */
  .pp-glossary-term {
    font-size: 15.5px;
    color: #444;
    line-height: 1.68;
    margin-bottom: 14px;
  }
  .pp-glossary-term strong { color: #222; }

  @media (max-width: 640px) {
    .pp-container { padding: 28px 16px 60px; }
    .pp-table thead th, .pp-table tbody td { padding: 10px 12px; font-size: 13.5px; }
  }
`;

export default function PrivacyPolicy() {
  return (
    <>
      <style>{styles}</style>
      <div className="pp-root">
        <div className="pp-container">
          <h1 className="pp-title">The Digital Economist Privacy Policy</h1>

          <p className="pp-intro">
            <strong>The Digital Economist</strong> respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          {/* Section 1 */}
          <div className="pp-section">
            <h2 className="pp-section-title">1. Important Information and Who We Are</h2>
            <p className="pp-body">
              This privacy policy aims to give you information on how The Digital Economist collects and processes your personal data through your use of this website, including any data you may provide when you sign up to our newsletter, purchase a service, or request more information.
            </p>
            <p className="pp-body"><strong>This website is not intended for children</strong> and we do not knowingly collect data relating to children.</p>

            <div className="pp-sub-title">Controller</div>
            <p className="pp-body">The Digital Economist is the controller and responsible for your personal data (collectively referred to as The Digital Economist, "we", "us" or "our" in this privacy policy).</p>

            <div className="pp-sub-title">Contact Details</div>
            <div className="pp-contact-info">
              <div><strong>Full name of legal entity:</strong> The Digital Economist LLC</div>
              <div><strong>Email address:</strong> info@thedigitaleconomist.com</div>
              <div><strong>Telephone number:</strong> +1 857 242 8444</div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="pp-section">
            <h2 className="pp-section-title">2. The Data We Collect About You</h2>
            <p className="pp-body">Personal data means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ol className="pp-numbered-list">
              <li><strong>Identity Data:</strong> first name, last name, username, title, and gender</li>
              <li><strong>Contact Data:</strong> billing address, delivery address, email address and telephone numbers</li>
              <li><strong>Financial Data:</strong> bank account and payment card details</li>
              <li><strong>Transaction Data:</strong> details about payments and services purchased</li>
              <li><strong>Technical Data:</strong> IP address, login data, browser type, location, operating system</li>
              <li><strong>Usage Data:</strong> information about how you use our website and services</li>
              <li><strong>Marketing and Communications Data:</strong> your marketing preferences and communication preferences</li>
            </ol>
          </div>

          {/* Section 3 */}
          <div className="pp-section">
            <h2 className="pp-section-title">3. How Is Your Personal Data Collected?</h2>
            <p className="pp-body">We use different methods to collect data from and about you including:</p>

            <div className="pp-sub-title">Direct Interactions</div>
            <p className="pp-body">You may give us your data by filling in forms or corresponding with us when you:</p>
            <ul className="pp-bullet-list">
              <li>Apply for our services</li>
              <li>Subscribe to our publications</li>
              <li>Request marketing materials</li>
              <li>Enter a survey</li>
              <li>Give us feedback or contact us</li>
            </ul>

            <div className="pp-sub-title">Automated Technologies</div>
            <p className="pp-body">We automatically collect Technical Data about your equipment and browsing actions through cookies, server logs and similar technologies.</p>

            <div className="pp-sub-title">Third Parties</div>
            <p className="pp-body">We receive Technical Data from analytics providers such as Google.</p>
          </div>

          {/* Section 4 */}
          <div className="pp-section">
            <h2 className="pp-section-title">4. How We Use Your Personal Data</h2>
            <p className="pp-body">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data where:</p>
            <ul className="pp-bullet-list">
              <li>We need to perform the contract we have with you</li>
              <li>It is necessary for our legitimate interests</li>
              <li>We need to comply with a legal obligation</li>
            </ul>

            <div className="pp-table-wrap">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Purpose/Activity</th>
                    <th>Type of Data</th>
                    <th>Lawful Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Register you as a new customer</td>
                    <td>Identity, Contact</td>
                    <td>Performance of contract</td>
                  </tr>
                  <tr>
                    <td>Process and deliver your order</td>
                    <td>Identity, Contact, Financial, Transaction</td>
                    <td>Performance of contract, Legitimate interests</td>
                  </tr>
                  <tr>
                    <td>Manage our relationship with you</td>
                    <td>Identity, Contact, Marketing</td>
                    <td>Performance of contract, Legal obligation, Legitimate interests</td>
                  </tr>
                  <tr>
                    <td>Enable surveys and feedback</td>
                    <td>Identity, Contact, Usage</td>
                    <td>Performance of contract, Legitimate interests</td>
                  </tr>
                  <tr>
                    <td>Deliver relevant content and advertisements</td>
                    <td>Identity, Contact, Technical, Usage</td>
                    <td>Legitimate interests</td>
                  </tr>
                  <tr>
                    <td>Data analytics and website improvement</td>
                    <td>Technical, Usage</td>
                    <td>Legitimate interests</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pp-sub-title">Marketing</div>
            <p className="pp-body">We may use your data to form a view on what may be of interest to you. You will receive marketing communications from us if you have requested information or purchased services and have not opted out.</p>
            <p className="pp-body"><strong>Opting Out:</strong> You can ask us to stop sending marketing messages at any time by following opt-out links or contacting us directly.</p>
          </div>

          {/* Section 5 */}
          <div className="pp-section">
            <h2 className="pp-section-title">5. Disclosures of Your Personal Data</h2>
            <p className="pp-body">We may share your personal data with:</p>
            <ul className="pp-bullet-list">
              <li>Internal third parties</li>
              <li>External third parties (service providers, professional advisers)</li>
              <li>Third parties in case of business sale, transfer, or merger</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="pp-section">
            <h2 className="pp-section-title">6. International Transfers</h2>
            <p className="pp-body">The Digital Economist and many external third parties are based outside the EEA. When we transfer your personal data outside the EEA, we ensure similar protection through appropriate safeguards, including Privacy Shield frameworks where applicable.</p>
          </div>

          {/* Section 7 */}
          <div className="pp-section">
            <h2 className="pp-section-title">7. Data Security</h2>
            <p className="pp-body">We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to those who have a business need to know and have procedures to deal with any suspected personal data breach.</p>
          </div>

          {/* Section 8 */}
          <div className="pp-section">
            <h2 className="pp-section-title">8. Data Retention</h2>
            <p className="pp-body">We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for legal, regulatory, tax, accounting or reporting requirements.</p>
            <p className="pp-body">To determine the appropriate retention period, we consider:</p>
            <ul className="pp-bullet-list">
              <li>The amount, nature and sensitivity of the personal data</li>
              <li>The potential risk of harm from unauthorized use or disclosure</li>
              <li>The purposes for processing and whether we can achieve those purposes through other means</li>
              <li>Applicable legal and regulatory requirements</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div className="pp-section">
            <h2 className="pp-section-title">9. Your Legal Rights</h2>
            <p className="pp-body">Under data protection laws, you have the right to:</p>
            <ul className="pp-rights-list">
              <li><strong>Request access</strong> to your personal data</li>
              <li><strong>Request correction</strong> of your personal data</li>
              <li><strong>Request erasure</strong> of your personal data</li>
              <li><strong>Object to processing</strong> of your personal data</li>
              <li><strong>Request restriction</strong> of processing your personal data</li>
              <li><strong>Request transfer</strong> of your personal data</li>
              <li><strong>Withdraw consent</strong> at any time</li>
            </ul>
            <p className="pp-note"><strong>No Fee Usually Required:</strong> You will not have to pay a fee to access your personal data or exercise other rights, unless your request is clearly unfounded, repetitive, or excessive.</p>
            <p className="pp-note"><strong>Time Limit:</strong> We try to respond to all legitimate requests within one month.</p>
          </div>

          {/* Section 10 */}
          <div className="pp-section">
            <h2 className="pp-section-title">10. Glossary</h2>
            <div className="pp-sub-title">Lawful Basis</div>
            <p className="pp-glossary-term"><strong>Legitimate Interest:</strong> The interest of our business in conducting and managing our business to enable us to give you the best service and most secure experience.</p>
            <p className="pp-glossary-term"><strong>Performance of Contract:</strong> Processing your data where necessary for the performance of a contract with you.</p>
            <p className="pp-glossary-term"><strong>Legal Obligation:</strong> Processing your personal data where necessary for compliance with a legal obligation.</p>
          </div>

          <div className="pp-last-updated">Last updated: 2026</div>
        </div>
      </div>
    </>
  );
}