import { useState, useCallback } from "react";

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

const MOCK_EMAILS: Email[] = [
  {
    id: "1",
    from: "noreply@github.com",
    fromName: "GitHub",
    subject: "Your verification code",
    snippet: "Your GitHub verification code is 847293. This code expires in 10 minutes...",
    body: `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Your GitHub verification code</h2>
      <p>Hi there,</p>
      <p>Your GitHub verification code is: <strong style="font-size: 24px;">847293</strong></p>
      <p>This code expires in 10 minutes. If you didn't request this code, please ignore this email.</p>
      <p>— The GitHub Team</p>
    </div>`,
    date: new Date(Date.now() - 120000),
    read: false,
    hasAttachment: false,
  },
  {
    id: "2",
    from: "welcome@spotify.com",
    fromName: "Spotify",
    subject: "Welcome to Spotify! Confirm your email",
    snippet: "Thanks for signing up! Please confirm your email address to get started with Spotify...",
    body: `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Welcome to Spotify!</h2>
      <p>Thanks for signing up. Please confirm your email address by clicking the button below.</p>
      <p><a href="#" style="background: #1DB954; color: white; padding: 12px 24px; border-radius: 20px; text-decoration: none;">Confirm Email</a></p>
      <p>If you didn't create a Spotify account, you can ignore this email.</p>
    </div>`,
    date: new Date(Date.now() - 300000),
    read: true,
    hasAttachment: false,
  },
  {
    id: "3",
    from: "no-reply@accounts.google.com",
    fromName: "Google",
    subject: "Security alert: New sign-in detected",
    snippet: "A new sign-in was detected on your account. If this was you, you can ignore this message...",
    body: `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Security Alert</h2>
      <p>A new sign-in was detected on your Google Account.</p>
      <p><strong>Device:</strong> Chrome on Windows<br/><strong>Location:</strong> New York, USA<br/><strong>Time:</strong> Just now</p>
      <p>If this was you, you can ignore this message. If not, please secure your account.</p>
    </div>`,
    date: new Date(Date.now() - 600000),
    read: true,
    hasAttachment: true,
  },
];

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function useEmailStore() {
  const [currentEmail, setCurrentEmail] = useState(() => `${generateRandomString(10)}@${DOMAINS[0]}`);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(() => new Date(Date.now() + 10 * 60 * 1000));

  const generateNewEmail = useCallback((customPrefix?: string) => {
    const prefix = customPrefix || generateRandomString(10);
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    setCurrentEmail(`${prefix}@${domain}`);
    setEmails(MOCK_EMAILS);
    setSelectedEmailId(null);
    setExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
  }, []);

  const extendTime = useCallback(() => {
    setExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
  }, []);

  const deleteInbox = useCallback(() => {
    setEmails([]);
    setSelectedEmailId(null);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
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
