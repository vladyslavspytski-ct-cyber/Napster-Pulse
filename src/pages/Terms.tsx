import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 py-16 md:py-24">
      <div className="section-container">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: June 25, 2025</p>

        <div className="space-y-8">
          <section className="glass-card rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
              IMPORTANT: Please read these Terms of Service carefully and keep a copy for your records. This document outlines our legal obligations and your limited legal remedies including (as applicable) mandatory arbitration, waiver of jury trial, waiver of class action, and/or limitation of liability.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Your Acceptance</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>By accessing or using any Service (defined below) you agree to be bound by these terms of service (referred to in this document as the "Agreement"). If you do not agree to the terms of this Agreement, you must not use the Services. This Agreement applies to all users of the Services, unless a separate agreement has been entered into between us and you.</p>
              <p>Your personal data will be processed in accordance with our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. You should review our Privacy Policy before accessing or using the Services.</p>
              <p><strong>YOUR CONTINUED USE OF THE SERVICES IS SUBJECT TO YOUR CONTINUED COMPLIANCE WITH THIS AGREEMENT. IF YOU DO NOT AGREE TO BE BOUND BY THIS AGREEMENT, YOU MAY NOT USE THE SERVICES.</strong></p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Changes to this Agreement</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>We may amend this Agreement on 30 days' written notice to you. Continued use of the Services after the effective date constitutes your acceptance of the updated terms.</p>
              <p>Where we amend this Agreement or the Services for legal or safety reasons, we may do so without providing written notice.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Account Registration & Eligibility</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>If you are using the Services on behalf of a company, partnership, or other legal entity ("Organization"), you represent that you have the authority to accept the terms of this Agreement on behalf of that entity.</p>
              <p>You must be at least 18 years old and capable of forming a binding contract to use the Services.</p>
              <p>In order to access the Services, you will need to create an account. When creating your account, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure.</p>
              <p>Although Company will not be liable to you for any losses caused by unauthorized use of your account, you may be liable for the losses of Company or others due to such unauthorized use.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Account Termination Policy</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Company may suspend or terminate your right to submit Content or your access to the Services if you are reasonably believed to be a repeat infringer of the intellectual property rights of third parties.</p>
              <p>Company reserves the right to decide whether your use of the Services violates this Agreement and may at any time, without prior notice and in its sole discretion, remove your Content from the Services and/or terminate your account.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Licenses & Intellectual Property Rights</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>You hereby grant Company a worldwide, non-exclusive, royalty-free, perpetual, fully paid-up, irrevocable, and sub-licensable license to use, reproduce, modify, prepare derivative works of, communicate, perform and distribute your Content through any means or channel, in order to provide, maintain and improve the Services.</p>
              <p>The Services and all names, logos, text, designs, graphics, trade dress, interfaces, code, software, images, and other content appearing in or on the Services are Company's (or its licensors') exclusive intellectual property. No intellectual property rights are granted to you in relation to your use of the Services, except as expressly set out in this Agreement.</p>
              <p>Subject to your compliance with the terms of this Agreement, Company hereby grants to you a personal, limited, non-exclusive, non-transferable license to use the Services strictly in accordance with the terms of this Agreement. Reverse-engineering, decompiling, modifying, or attempting to extract the source code of the software used in the Services is prohibited.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Acceptable Use & Conduct</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>While using the Services, you are required to comply with all applicable statutes, orders, regulations, rules, and other laws. You may not use the Services for any fraudulent or unlawful purpose, and you may not take any action to interfere with the Services or any other party's use of the Services.</p>
              <p>Company has the right (but not the obligation) to monitor your use of the Services (including your Content) for compliance with our acceptable use policy and delete Content and outputs in its sole discretion.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Third Party Terms</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Company Services integrate with third-party services. Your use of any third-party service may be subject to a third-party provider's terms and conditions, intellectual property restrictions and privacy policy.</p>
              <p>You acknowledge and agree that Company is not responsible for the availability of any third-party services and that Company shall not be responsible or liable for any damage or loss caused by or in connection with your use of or interaction with any third-party services.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Voice, Image & Recording Consent</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Certain features on the Services capture your voice and/or likeness, as further described in our Privacy Policy. You agree that you will only enable these features or otherwise upload Content where you are the person depicted in the Content, or if others are depicted, you represent that you have obtained all necessary authorizations and proper rights from the persons depicted.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Service Limitations</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Company utilizes generative artificial intelligence ("AI") technology to provide, enhance and improve the Services. This technology is still experimental and evolving and there may be instances where AI within the Services may not function as intended, experience performance limitations, or produce unexpected, fictitious, incorrect, or offensive outcomes.</p>
              <p>You agree that Company will not be held responsible for any issues, errors, loss or damages arising from your use of AI within the Services. You remain solely responsible for verifying any output from the Services before relying on it and you should not rely on outputs from AI within the Services as a sole source of truth or factual information, or as a substitute for professional advice.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Fees & Payment</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Terms regarding fees and payment will be provided to you when you place an order with us or within the relevant order form.</p>
              <p>Company may use a third-party payment processor to process your payment information. Be aware that you may be subject to the third-party processor's terms and your information may be subject to their privacy practices.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Cancellation & Refund Policy</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>You may cancel your subscription at any time from your account settings. Cancellations apply to future billing cycles only; no partial refunds will be issued for any unused time in the current billing period once it has started.</p>
              <p>You may cancel any purchase for a full refund within 14 days of the purchase date, provided you have not accessed the subscription during this period.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Termination of this Agreement</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Either party may terminate this Agreement immediately upon notice for material breach incapable of cure, or material breach capable of cure after 30 days' notice and opportunity to cure.</p>
              <p>Company can withdraw or amend the Services, in whole or in part, and/or terminate this Agreement at any time without giving notice to you, for any or no reason at all.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Warranty and Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              YOU AGREE THAT YOUR USE OF THE SERVICES SHALL BE AT YOUR SOLE RISK. THE SERVICES ARE PROVIDED "AS IS" AND ON AN "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICE AND YOUR USE THEREOF. COMPANY MAKES NO WARRANTIES OR REPRESENTATIONS ABOUT THE USE, ACCURACY, VALIDITY, RELIABILITY, OR COMPLETENESS OF THE CONTENT AND ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, ANY PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICE, ANY UNAUTHORIZED ACCESS TO OUR SECURE SERVERS, ANY INTERRUPTION OR CESSATION OF TRANSMISSION, ANY BUGS, VIRUSES, OR TROJAN HORSES, OR ANY ERRORS OR OMISSIONS IN ANY CONTENT.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Limitation of Liability</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Nothing in this Agreement is intended to limit or exclude Company's liability where this is not permitted by applicable laws.</p>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL WE BE LIABLE TO YOU OR ANY THIRD-PARTY FOR ANY LOSS OF PROFITS, LOSS OF GOODWILL OR ANY OTHER INTANGIBLE LOSS, OR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR INABILITY TO ACCESS OR USE, THE SERVICES.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">15. Indemnity</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You will be responsible to pay for any losses caused to Company as a result of any breach of your obligations under this Agreement. You agree to indemnify, defend, and hold Company and all of its directors, officers, employees, agents, shareholders, successors, assigns, and contractors harmless from and against any and all claims, damages, suits, actions, liabilities, judgments, losses, costs, or other expenses that arise directly or indirectly out of or from your breach of any provision of this Agreement, your activities in connection with the Services, or Content or other information you provide to Company through the Services.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">16. Governing Law & Jurisdiction</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>Where required by applicable laws, this Agreement and all disputes that may relate to the Agreement shall be governed by the laws of the country in which you reside.</p>
              <p>If you live in the EU, nothing in this Agreement shall override mandatory local laws or jurisdiction provisions.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">17. For U.S. Users – Dispute Resolution</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p className="font-semibold">PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.</p>
              <p><strong>Binding Arbitration:</strong> You and Company agree that in the event a dispute or controversy arises between the parties under or in connection with this Agreement or the use or inability to use the Services, such dispute shall be submitted to arbitration. Prior to initiating arbitration, you must first contact Company and present your claim to allow Company the opportunity to resolve it.</p>
              <p><strong>Class Action Waiver:</strong> You agree that any claims or arbitration under this Agreement will take place on an individual basis; class arbitrations and class actions are not permitted, and you and Company are agreeing to give up the ability to participate in a class arbitration or class action.</p>
              <p><strong>Jury Trial Waiver:</strong> You and Company are each waiving the right to a trial by jury.</p>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">18. Miscellaneous</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>Neither party can give up a right under this Agreement unless it is done in writing.</li>
              <li>If a court invalidates some of this Agreement, the rest of it will still apply.</li>
              <li>This Agreement shall constitute the entire agreement between you and Company concerning the Services.</li>
              <li>You agree that there shall be no third party beneficiaries to this Agreement.</li>
              <li>Company reserves the right to amend this Agreement at any time and without notice, and it is your responsibility to review this Agreement for any changes.</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">19. Contact Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have questions, you may contact us at: <a href="mailto:support@interu.ai" className="text-primary hover:underline">support@interu.ai</a>
            </p>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Acceptable Use Policy (AUP)</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong>Prohibited Content:</strong> Child sexual content, extremist propaganda, graphic violence, content that is unlawful, unsolicited, harmful, harassing, defamatory, threatening, intimidating, fraudulent, vulgar, obscene, hateful, pornographic, spam, discriminatory, infringes on any intellectual property, or is otherwise objectionable.</li>
              <li><strong>Prohibited Practices:</strong> Infecting the Services with viruses, malware, or other malicious code; using data mining, bots, spiders, or automated tools on the Services; using the Services to commit fraud, violate the law, or cause harm.</li>
              <li><strong>Impersonation & Likeness:</strong> You must not create or deploy any AI persona or media that depicts or convincingly imitates a real individual without verifiable, written consent.</li>
              <li><strong>Voice & Biometric Data:</strong> Uploading or cloning another person's voice, image, or recording data requires that individual's explicit, recorded consent.</li>
              <li><strong>Prompt Manipulation:</strong> Attempts to override or bypass system prompts, safety filters, or role segmentation are prohibited.</li>
              <li><strong>Reporting:</strong> Suspected violations can be reported at <a href="mailto:support@interu.ai" className="text-primary hover:underline">support@interu.ai</a>.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
