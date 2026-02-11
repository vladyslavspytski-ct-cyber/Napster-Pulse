import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  { title: "1. Information We Collect", body: "We collect information you provide directly, such as your email address and interview content, as well as usage data like browser type and access times." },
  { title: "2. How We Use Your Information", body: "We use your information to provide and improve the platform, communicate with you, and ensure the security of our services." },
  { title: "3. Data Storage & Security", body: "Your data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your information." },
  { title: "4. Sharing of Information", body: "We do not sell your personal information. We may share data with trusted service providers who assist in operating the platform, subject to confidentiality obligations." },
  { title: "5. Your Rights", body: "You have the right to access, correct, or delete your personal data. Contact us to exercise these rights." },
  { title: "6. Cookies", body: "We use essential cookies to ensure the platform functions correctly. We do not use third-party tracking cookies without your consent." },
  { title: "7. Changes to This Policy", body: "We may update this privacy policy periodically. We will notify you of significant changes via email or a notice on our platform." },
];

const Privacy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 py-16 md:py-24">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
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

export default Privacy;
