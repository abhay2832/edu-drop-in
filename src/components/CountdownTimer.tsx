import { useState, useEffect } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CountdownTimerProps {
  expiresAt: Date;
  onExtend: () => void;
}

const CountdownTimer = ({ expiresAt, onExtend }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = Math.min(100, (timeLeft / 600) * 100);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Expires in</span>
          <span className="font-mono font-semibold text-foreground">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onExtend}
        className="h-8 gap-1 text-xs text-muted-foreground hover:text-primary"
      >
        <RefreshCw className="h-3 w-3" />
        Extend
      </Button>
    </div>
  );
};

export default CountdownTimer;
