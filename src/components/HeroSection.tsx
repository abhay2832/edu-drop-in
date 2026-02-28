import { useState } from "react";
import { Copy, RefreshCw, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  currentEmail: string;
  onGenerate: (prefix?: string) => void;
}

const HeroSection = ({ currentEmail, onGenerate }: HeroSectionProps) => {
  const [copied, setCopied] = useState(false);
  const [customPrefix, setCustomPrefix] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomGenerate = () => {
    if (customPrefix.trim()) {
      onGenerate(customPrefix.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ""));
      setCustomPrefix("");
      setShowCustom(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Free &amp; Anonymous — No Registration Required
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Best EDU Temp Email
            <br />
            <span className="text-primary glow-text">Generator</span>
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-base text-muted-foreground md:text-lg">
            Instant disposable email addresses. Protect your privacy, bypass spam, and keep your real inbox clean.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-xl"
        >
          {/* Email display */}
          <div className="gradient-border mb-4 flex items-center gap-2 rounded-xl bg-card p-2">
            <div className="flex-1 rounded-lg bg-secondary px-4 py-3 font-mono text-sm text-foreground md:text-base select-all">
              {currentEmail}
            </div>
            <Button
              onClick={handleCopy}
              size="icon"
              variant="ghost"
              className="h-10 w-10 shrink-0 text-muted-foreground hover:text-primary"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => onGenerate()}
              size="icon"
              className="h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Custom prefix toggle */}
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Want a custom email name? Click here
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-2"
            >
              <Input
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="Enter custom prefix..."
                className="bg-card font-mono text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleCustomGenerate()}
                maxLength={30}
              />
              <Button onClick={handleCustomGenerate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Generate
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
