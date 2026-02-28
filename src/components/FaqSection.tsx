import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is a temporary email address?",
    a: "A temporary email address is a disposable email that you can use for a short time. It's perfect for signing up for services, receiving verification codes, or protecting your real email from spam.",
  },
  {
    q: "How long does the temporary email last?",
    a: "Each email address is valid for 10 minutes by default. You can extend the timer at any time by clicking the 'Extend' button to get another 10 minutes.",
  },
  {
    q: "Is this service completely free?",
    a: "Yes, TempMail is 100% free to use. There are no hidden charges, no premium tiers, and no registration required.",
  },
  {
    q: "Can I use this for EDU email verification?",
    a: "We offer .edu domain options that can be used for educational service verifications. However, availability depends on current domain status.",
  },
  {
    q: "Is my privacy protected?",
    a: "Absolutely. We don't require any personal information, don't use tracking cookies, and all emails are automatically deleted after expiration. Your session is completely anonymous.",
  },
  {
    q: "Can I receive attachments?",
    a: "Yes, you can receive and download email attachments. All attachments are scanned for safety before being made available for download.",
  },
];

const FaqSection = () => (
  <section id="faq" className="border-t border-border/50 py-16 md:py-24">
    <div className="container mx-auto max-w-2xl px-4">
      <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
        Frequently Asked <span className="text-primary">Questions</span>
      </h2>
      <p className="mb-10 text-center text-sm text-muted-foreground">
        Everything you need to know about our temp email service
      </p>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-xl border border-border bg-card px-4 data-[state=open]:border-primary/30"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;
