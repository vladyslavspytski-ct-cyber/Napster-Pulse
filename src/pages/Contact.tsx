import { Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Contact = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 py-16 md:py-24">
      <div className="section-container">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Have a question or feedback? We'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">Get in Touch</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reach out via email and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:hello@napsterpulse.io"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              hello@napsterpulse.io
            </a>
          </div>

          {/* Contact Form (non-functional) */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Send a Message</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea id="contact-message" placeholder="How can we help?" rows={4} />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
