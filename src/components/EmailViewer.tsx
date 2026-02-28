import { ArrowLeft, Download, Paperclip, ImageOff, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

interface Email {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  date: Date;
  hasAttachment: boolean;
}

interface EmailViewerProps {
  email: Email | null;
  currentAddress: string;
  onBack: () => void;
}

function sanitizeHtml(html: string, loadImages: boolean): string {
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
  
  if (!loadImages) {
    clean = clean.replace(/<img[^>]*>/gi, '<span style="color: gray;">[Image blocked]</span>');
  }
  return clean;
}

const EmailViewer = ({ email, currentAddress, onBack }: EmailViewerProps) => {
  const [loadImages, setLoadImages] = useState(false);

  const sanitizedBody = useMemo(() => {
    if (!email) return "";
    return sanitizeHtml(email.body, loadImages);
  }, [email, loadImages]);

  if (!email) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <Mail className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Select an email to read</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col"
    >
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
          <Download className="h-3 w-3" />
          Download .eml
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">{email.subject}</h2>

        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {email.fromName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{email.fromName}</p>
            <p className="text-xs text-muted-foreground">{email.from}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              To: {currentAddress} · {format(email.date, "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        {email.hasAttachment && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
            <Paperclip className="h-3 w-3" />
            <span>1 attachment</span>
            <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs text-primary">
              Download
            </Button>
          </div>
        )}

        {!loadImages && (
          <button
            onClick={() => setLoadImages(true)}
            className="mb-4 flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning transition-colors hover:bg-warning/20"
          >
            <ImageOff className="h-3 w-3" />
            External images blocked for privacy. Click to load.
          </button>
        )}

        <div
          className="max-w-none text-sm text-secondary-foreground [&_a]:text-primary [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-3 [&_p]:mb-2 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />
      </div>
    </motion.div>
  );
};

export default EmailViewer;
