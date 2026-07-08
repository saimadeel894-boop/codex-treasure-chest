import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Nestoria Australia" },
      { name: "description", content: "The terms that govern your use of the Nestoria Australia marketplace." },
      { property: "og:title", content: "Terms & Conditions | Nestoria Australia" },
      { property: "og:description", content: "Rules for buyers, renters, sellers, and agents using Nestoria Australia." },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Acceptance of terms",
    body: "By accessing or using Nestoria Australia you agree to these terms. If you do not agree, please do not use the service.",
  },
  {
    title: "Using the marketplace",
    body: "You must be at least 18 years old to create an account. You are responsible for keeping your login credentials confidential and for all activity on your account.",
  },
  {
    title: "Listing properties",
    body: "Listings must be accurate, lawful, and represent genuine properties you are authorised to market. Misleading, duplicate, or prohibited listings may be removed without notice.",
  },
  {
    title: "Enquiries and contact",
    body: "When you enquire about a listing your contact details are shared with the listing agent. Please communicate respectfully. Harassment or spam is not tolerated on either side.",
  },
  {
    title: "Intellectual property",
    body: "All Nestoria branding, design, and code are our property. Listing content remains the property of the person who submitted it, who grants us a licence to display it on the marketplace.",
  },
  {
    title: "Disclaimers",
    body: "Nestoria Australia is a marketplace connecting buyers, renters, sellers, and agents. We do not own the properties listed and do not provide legal, financial, or valuation advice. Always seek professional advice before making a property decision.",
  },
  {
    title: "Limitation of liability",
    body: "To the fullest extent permitted by Australian law, Nestoria Australia is not liable for indirect or consequential loss arising from your use of the platform, including reliance on listing information provided by third parties.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. Material changes will be communicated via email or an on-site notice. Continued use of the platform means you accept the updated terms.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of New South Wales, Australia.",
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Legal</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">Terms & Conditions</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: 1 July 2026</p>
      <p className="mt-6 leading-7 text-charcoal-soft">
        These terms govern your access to and use of Nestoria Australia. Please read them carefully.
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
