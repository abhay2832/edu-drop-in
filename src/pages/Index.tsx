import { Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailStore } from "@/hooks/useEmailStore";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import CountdownTimer from "@/components/CountdownTimer";
import InboxList from "@/components/InboxList";
import EmailViewer from "@/components/EmailViewer";
import FeaturesSection from "@/components/FeaturesSection";
import FaqSection from "@/components/FaqSection";

const Index = () => {
  const {
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
  } = useEmailStore();

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    markAsRead(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection currentEmail={currentEmail} onGenerate={generateNewEmail} />

      {/* Inbox Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {/* Timer + Actions */}
          <div className="mx-auto mb-4 max-w-4xl flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <CountdownTimer expiresAt={expiresAt} onExtend={extendTime} />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateNewEmail()}
                className="gap-1 border-border text-xs"
              >
                <RefreshCw className="h-3 w-3" />
                Fast OTP
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteInbox}
                className="gap-1 border-border text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
                Delete All
              </Button>
            </div>
          </div>

          {/* Split Inbox */}
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex min-h-[400px] flex-col md:flex-row">
              {/* Email List */}
              <div
                className={`w-full border-b border-border md:w-80 md:border-b-0 md:border-r ${
                  selectedEmailId ? "hidden md:block" : ""
                }`}
              >
                <div className="border-b border-border/50 px-4 py-3">
                  <h3 className="text-sm font-semibold">
                    Inbox{" "}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({emails.filter((e) => !e.read).length} unread)
                    </span>
                  </h3>
                </div>
                <InboxList
                  emails={emails}
                  selectedId={selectedEmailId}
                  onSelect={handleSelectEmail}
                />
              </div>

              {/* Email Viewer */}
              <div
                className={`flex flex-1 flex-col ${
                  !selectedEmailId ? "hidden md:flex" : ""
                }`}
              >
                <EmailViewer
                  email={selectedEmail}
                  currentAddress={currentEmail}
                  onBack={() => setSelectedEmailId(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <FaqSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
