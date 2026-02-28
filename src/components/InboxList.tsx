import { Mail, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface Email {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  snippet: string;
  date: Date;
  read: boolean;
  hasAttachment: boolean;
}

interface InboxListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const InboxList = ({ emails, selectedId, onSelect }: InboxListProps) => {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <Mail className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No emails yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Waiting for incoming messages...
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Listening</span>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {emails.map((email, i) => (
        <motion.button
          key={email.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(email.id)}
          className={`w-full px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${
            selectedId === email.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {!email.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              <span className={`truncate text-sm ${!email.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {email.fromName}
              </span>
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatDistanceToNow(email.date, { addSuffix: true })}
            </span>
          </div>
          <p className={`mt-0.5 truncate text-sm ${!email.read ? "font-medium text-foreground" : "text-secondary-foreground"}`}>
            {email.subject}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="flex-1 truncate text-xs text-muted-foreground">{email.snippet}</p>
            {email.hasAttachment && <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default InboxList;
