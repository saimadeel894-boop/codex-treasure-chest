import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Nestoria Australia" },
      { name: "description", content: "How Nestoria Australia collects, uses, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy | Nestoria Australia" },
      { property: "og:description", content: "Our privacy practices for buyers, renters, sellers, and agents." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "Information we collect",
    body: "We collect information you provide when you create an account, save a property, contact an agent, or list a property — including your name, email, phone number, and property preferences. We also collect basic usage data (device, browser, pages viewed) to improve the experience.",
  },
  {
    title: "How we use your information",
    body: "Your information helps us deliver core marketplace features: matching you with relevant listings, connecting you with agents, sending inspection reminders, and providing customer support. We never sell personal data.",
  },
  {
    title: "Sharing with agents and agencies",
    body: "When you enquire about a property, your contact details are shared with the listing agent so they can respond. Agents are bound by our platform terms and by Australian Privacy Principles.",
  },
  {
    title: "Cookies and analytics",
    body: "We use essential cookies for authentication and preferences, and privacy-respecting analytics to understand aggregate usage. You can control cookies through your browser settings.",
  },
  {
    title: "Data retention",
    body: "We keep your account information for as long as your account is active. You can request deletion of your account and associated saved properties at any time by contacting us.",
  },
  {
    title: "Your rights",
    body: "Under the Australian Privacy Act, you have the right to access, correct, or request deletion of your personal information. To exercise these rights, email privacy@nestoria.example.",
  },
  {
    title: "Contact us",
    body: "For questions about this policy, contact our privacy team at privacy@nestoria.example or write to Nestoria Australia, Level 12, 1 Market Street, Sydney NSW 2000.",
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Legal</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 1 July 2026</p>
      <p className="mt-6 leading-7 text-charcoal-soft">
        This Privacy Policy explains how Nestoria Australia ("we", "us") collects and handles personal information
        when you use our property marketplace. This page is maintained by Nestoria Australia and describes our
        current practices; it is not a legal certification.
      </p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-serif text-2xl text-charcoal">{s.title}</h2>
            <p className="mt-3 leading-7 text-charcoal-soft">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
