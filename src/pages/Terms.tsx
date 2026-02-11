import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  { title: "1. Acceptance of Terms", body: "By accessing or using the Interu platform, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services." },
  { title: "2. Description of Service", body: "Interu provides a voice-based interview creation and participation platform. We reserve the right to modify, suspend, or discontinue any part of the service at any time." },
  { title: "3. User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
  { title: "4. Acceptable Use", body: "You agree not to use the platform for any unlawful purpose or in any way that could damage, disable, or impair the service." },
  { title: "5. Intellectual Property", body: "All content, trademarks, and materials on the platform are owned by Interu or its licensors. You may not reproduce or distribute any content without prior written consent." },
  { title: "6. Limitation of Liability", body: "Interu shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform." },
  { title: "7. Changes to Terms", body: "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms." },
];

const Terms = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 py-16 md:py-24">
      <div className="section-container">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: February 2026</p>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
