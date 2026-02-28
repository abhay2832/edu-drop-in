import { Zap, Shield, Clock, Inbox, Eye, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "Instant Generation", desc: "Get a working email address in one click. No signup required." },
  { icon: Shield, title: "Complete Privacy", desc: "100% anonymous. We never ask for personal information." },
  { icon: Clock, title: "Auto-Expiring", desc: "Emails auto-delete after expiration. No traces left behind." },
  { icon: Inbox, title: "Real-Time Inbox", desc: "Receive emails instantly with live WebSocket updates." },
  { icon: Eye, title: "Safe Viewing", desc: "HTML emails are sanitized. External images blocked by default." },
  { icon: Trash2, title: "No Data Stored", desc: "All data is temporary. Nothing is stored permanently." },
];

const steps = [
  { num: "01", title: "Generate", desc: "Click the button to get your temporary email address instantly." },
  { num: "02", title: "Use It", desc: "Use it for signups, verifications, or anywhere you need an email." },
  { num: "03", title: "Receive", desc: "Incoming emails appear in real-time. Read them right here." },
];

const FeaturesSection = () => (
  <section id="features" className="py-16 md:py-24">
    <div className="container mx-auto px-4">
      {/* How it works */}
      <div className="mb-20">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
          How It <span className="text-primary">Works</span>
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">Three simple steps to protect your inbox</p>
        
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gradient-border rounded-xl bg-card p-6 text-center"
            >
              <span className="mb-2 block font-mono text-2xl font-bold text-primary">{s.num}</span>
              <h3 className="mb-1 text-base font-semibold">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
        Why Choose <span className="text-primary">TempMail</span>?
      </h2>
      <p className="mb-10 text-center text-sm text-muted-foreground">Built with security and privacy at the core</p>
      
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <f.icon className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-1 text-sm font-semibold">{f.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
