import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 py-16 md:py-24">
      <div className="section-container">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated and effective date: May 15, 2025</p>

        <div className="space-y-8">
          <section className="glass-card rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Privacy Policy ("Policy") describes how Napster Connect and its affiliates and subsidiaries (collectively, "Company," "we," "our," or "us") collects, discloses, or otherwise processes Personal Data (defined below) when we act as a data controller in relation to the operation of our business including through our websites, our digital platform of AI-driven products, any communications between you and us, such as through customer service interactions and emails and other communications we send, and where this Policy is posted (collectively, the "Services").
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              This Policy does not apply to Personal Data for which Company is acting as a processor on behalf of a controller such as when we perform Services on behalf of our business customers (e.g., where we do not determine the purpose and means of the data processing).
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">1. What Personal Data We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              <strong>"Personal Data"</strong> means any data that identifies, relates to, describes, or is reasonably capable of being associated, linked or linkable with a particular individual or household.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">The types of Personal Data we collect and process includes:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong>Identifiers:</strong> A real name, alias, unique personal identifier, online identifier, device IDs, IP address, email address, account name, or other similar identifiers.</li>
              <li><strong>Demographic information:</strong> Including age, national origin, citizenship, and any other characteristics of protected classifications under applicable law.</li>
              <li><strong>Commercial information:</strong> Records of products or services purchased, obtained, or considered, or other purchasing or consuming histories or tendencies, payment information, and information that you submit through reviews or customer service requests.</li>
              <li><strong>Internet or other similar network activity:</strong> Data collected via cookies, scripts, web beacons, and other technologies including your IP address, browsing and search history, language preferences, browser type, device information, and information on your interaction with the Services.</li>
              <li><strong>Geolocation data:</strong> Physical location or approximate location through a device's IP address or the location sharing enabled on your device.</li>
              <li><strong>Audio and visual information:</strong> Audio and visual information captured during your use of the Services, customer service calls, or reviews.</li>
              <li><strong>Inferences drawn from other Personal Data:</strong> Profile reflecting a person's preferences, characteristics, behavior, and attitudes.</li>
              <li><strong>Sensitive Personal Data:</strong> Such as account log-in and passwords that allow access to your account with us.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              We may also retain and use your Personal Data in an anonymized or de-identified format. Such data is not subject to the same usage restrictions as Personal Data as it does not directly (or indirectly) reveal your identity.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Collect Personal Data</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong>Directly from you.</strong> For instance when utilizing the Services, signing up for or logging into an account, communicating with us through the Services, submitting or responding to our inquiries, or filling out a form from us or surveys.</li>
              <li><strong>Automatically as you utilize the Services.</strong> We may receive Personal Data from you in connection with content, widgets, cookies, components, or other tools deployed on or used by the Services, including from third parties.</li>
              <li><strong>From third parties.</strong> We may collect Personal Data from service providers, analytics services, affiliates, promotional partners, and application providers.</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Purpose of Data that We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Company relies on one or more of the following legal bases for processing:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>We have obtained consent from you for such processing for one or more specific purposes.</li>
              <li>Processing is necessary for the performance of a contract to which you are party or to take steps at your request prior to entering into a contract.</li>
              <li>Processing is necessary to protect the vital interests of a data subject or of another natural person.</li>
              <li>Processing is necessary for compliance with a legal obligation to which Company is subject.</li>
              <li>Processing is necessary for the purposes of our or a third party's legitimate interest.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              We use your Personal Data to: provide the Services; facilitate payment; set up and manage your accounts; provide you with a customized experience; communicate with you; facilitate and store communications; for marketing and advertising; to analyze use of the Services and improve your experience; secure our systems and detect and prevent fraud; operate our business; and defend and enforce our legal rights.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies or similar technologies on the Services. You may use the Digital Advertising Alliance's tool to send requests for a web browser to opt out of the sale of Personal Data by some or all of that framework's participating companies.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We will only retain your Personal Data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your Personal Data for a longer period in the event of a complaint, for purposes of record keeping, or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">6. How We Secure Your Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are committed to maintaining measures to protect the security of your Personal Data maintained in our systems and have implemented appropriate technical and organizational measures to ensure a level of security appropriate to the risk. However, no network or system is ever entirely secure, and we cannot guarantee the security of networks and systems that we operate or that are operated on our behalf. If we face a security breach, we will notify you as required by law.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              The safety and security of your Personal Data also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of the Services, you are responsible for keeping this password confidential.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">7. With Whom We Disclose Personal Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">We may disclose Personal Data with:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong>Affiliated Organizations.</strong> We may disclose your Personal Data with our parent organizations, subsidiaries, affiliates, joint ventures, or other organizations or entities under common control with us.</li>
              <li><strong>Service Providers.</strong> We work with third parties to help us provide the Services and to support internal operations including by processing Personal Data on our behalf. Service providers have access to your Personal Data only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
              <li><strong>In Connection to a Transaction.</strong> In the event of a transaction or reorganization impacting us, we may disclose your Personal Data to facilitate such transaction, including mergers, sales, financing, acquisitions, or divestitures.</li>
              <li><strong>Professional Advisors, Law Enforcement and Regulators.</strong> We disclose Personal Data with our professional advisors and with regulators, law enforcement, or government agencies to comply with legal obligations, protect interests, or respond to legal process.</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Do Not Track Signals</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not respond to "do not track" signals or other mechanisms that provide consumers the ability to exercise choice regarding the collection of Personal Data about an individual consumer's online activities over time and across third-party websites or online services.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Children Under Age 18</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Company does not knowingly collect personally identifiable information from children under 18 without parental consent. In the event that we learn that we have collected such information from a child under the age of 18 without parental consent, we will delete this information from our database as quickly as possible. If you believe we have collected any personally identifiable information about anyone under 18, please contact us at <a href="mailto:support@napsterconnect.ai" className="text-primary hover:underline">support@napsterconnect.ai</a>.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">10. For Residents of California</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Under the California Consumer Protection Act (as amended by the California Privacy Rights Act), you have the following rights:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong>Right to Access.</strong> You can request that we confirm whether we process your Personal Data and obtain a copy of the Personal Data you previously provided us.</li>
              <li><strong>Right to Correct.</strong> You can request that we correct inaccurate Personal Data that we maintain about you.</li>
              <li><strong>Right to Delete.</strong> You can request that we delete your Personal Data that we maintain about you, subject to certain exceptions.</li>
              <li><strong>Right to opt out of sales and sharing.</strong> You can request that we not sell or share your Personal Data by emailing us.</li>
              <li><strong>Right to opt out of profiling.</strong> We do not profile in furtherance of decisions that produce a legal or similarly significant effect.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              We will not discriminate against you because you made any of these requests.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">11. For Residents of the EEA and UK — Your Legal Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              By law, you have a number of rights when it comes to your Personal Data. You may have the following rights:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong>Right to be informed.</strong> You have the right to be provided with clear, transparent, and easily understandable information about how we use your Personal Data and your rights.</li>
              <li><strong>Right of access.</strong> You have the right to access your Personal Data (commonly known as a "data subject access request").</li>
              <li><strong>Right of rectification.</strong> This allows you to have your information corrected if it is inaccurate or incomplete.</li>
              <li><strong>Right to withdraw consent.</strong> You have the right to withdraw your consent for the processing of Personal Data at any time.</li>
              <li><strong>Right to be forgotten/erasure.</strong> This allows you to request the deletion or removal of your Personal Data where there is no compelling reason for us to keep using it.</li>
              <li><strong>Right to restriction of processing.</strong> You have rights to 'block' or suppress further use of your Personal Data under certain circumstances.</li>
              <li><strong>Right to portability.</strong> You have the right to receive Personal Data concerning you in a structured, commonly used and machine-readable format.</li>
              <li><strong>Right to object.</strong> You have the right to object to certain types of processing, including processing for direct marketing purposes.</li>
              <li><strong>Right to lodge a complaint.</strong> You have the right to lodge a complaint with a national supervisory authority about the way we handle or process your Personal Data.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, please contact us at <a href="mailto:support@napsterconnect.ai" className="text-primary hover:underline">support@napsterconnect.ai</a>.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">12. International Data Transfers</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Company operates globally and may engage in international transfers of Personal Data. We transfer Personal Data across borders for the purposes described above in this Policy, including as necessary to operate our business and to provide and support the Services. Whenever we transfer your Personal Data outside of the UK/EEA, we will always ensure it is protected by reasonable safeguards.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Third-Party Links</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our Services may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy practices. When you leave the Services, we encourage you to read the privacy policy of every other website you visit.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We keep our Policy under regular review and may update it from time to time. Any changes will be posted on the Services and, where appropriate, notified to you. It is important that the Personal Data we hold about you is accurate and current. Please keep us informed if your Personal Data changes during your relationship with us.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">15. Contact Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have questions about this Policy, you may contact us at: <a href="mailto:support@napsterconnect.ai" className="text-primary hover:underline">support@napsterconnect.ai</a>
            </p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
