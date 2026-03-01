import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Email {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  snippet: string;
  body: string;
  date: Date;
  read: boolean;
  hasAttachment: boolean;
}

const DOMAINS = ["tempbox.io", "edu-mail.net", "quickmail.dev"];

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function mapDbEmail(row: any): Email {
  return {
    id: row.id,
    from: row.from_address,
    fromName: row.from_name || row.from_address.split("@")[0],
    subject: row.subject || "(no subject)",
    snippet: (row.body || "").replace(/<[^>]*>/g, "").slice(0, 80) + "...",
    body: row.body || "",
    date: new Date(row.received_at),
    read: row.is_read,
    hasAttachment: row.has_attachment,
  };
}

export function useEmailStore() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(() => new Date(Date.now() + 10 * 60 * 1000));
  const channelRef = useRef<any>(null);

  // Create a new session in the database
  const createSession = useCallback(async (emailAddress: string) => {
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const { data, error } = await supabase
      .from("temp_sessions")
      .insert({ email_address: emailAddress, expires_at: expiry.toISOString() })
      .select()
      .single();

    if (error) {
      console.error("Failed to create session:", error);
      // If unique constraint, try another email
      if (error.code === "23505") {
        const newAddr = `${generateRandomString(10)}@${DOMAINS[Math.floor(Math.random() * DOMAINS.length)]}`;
        return createSession(newAddr);
      }
      return;
    }

    setSessionId(data.id);
    setCurrentEmail(data.email_address);
    setExpiresAt(new Date(data.expires_at));
    setEmails([]);
    setSelectedEmailId(null);
    return data.id;
  }, []);

  // Fetch emails for current session
  const fetchEmails = useCallback(async (sid: string) => {
    const { data, error } = await supabase
      .from("incoming_emails")
      .select("*")
      .eq("session_id", sid)
      .order("received_at", { ascending: false });

    if (!error && data) {
      setEmails(data.map(mapDbEmail));
    }
  }, []);

  // Subscribe to real-time new emails
  useEffect(() => {
    if (!sessionId) return;

    // Cleanup previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`emails-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "incoming_emails",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newEmail = mapDbEmail(payload.new);
          setEmails((prev) => [newEmail, ...prev]);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const addr = `${generateRandomString(10)}@${DOMAINS[0]}`;
      await createSession(addr);
    };
    init();
  }, [createSession]);

  const generateNewEmail = useCallback(async (customPrefix?: string) => {
    const prefix = customPrefix || generateRandomString(10);
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const addr = `${prefix}@${domain}`;
    await createSession(addr);
  }, [createSession]);

  const extendTime = useCallback(async () => {
    if (!sessionId) return;
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await supabase
      .from("temp_sessions")
      .update({ expires_at: newExpiry.toISOString() })
      .eq("id", sessionId);
    setExpiresAt(newExpiry);
  }, [sessionId]);

  const deleteInbox = useCallback(async () => {
    if (!sessionId) return;
    await supabase.from("incoming_emails").delete().eq("session_id", sessionId);
    setEmails([]);
    setSelectedEmailId(null);
  }, [sessionId]);

  const markAsRead = useCallback(async (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
    await supabase.from("incoming_emails").update({ is_read: true }).eq("id", id);
  }, []);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;

  return {
    currentEmail,
    emails,
    selectedEmail,
    selectedEmailId,
    expiresAt,
    generateNewEmail,
    extendTime,
    deleteInbox,
    setSelectedEmailId,
    markAsRead,
  };
}
