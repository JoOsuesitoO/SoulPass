import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SaleLobby from "@/components/screens/SaleLobby";
import ProcessingQueue from "@/components/screens/ProcessingQueue";
import SoldOut from "@/components/screens/SoldOut";
import RewardClaimed from "@/components/screens/RewardClaimed";

type Screen = "lobby" | "processing" | "soldout" | "reward";

const TOTAL_TICKETS = 5000;
const FAKE_WALLET = "8xKf...3nPq";
const FULL_WALLET = "8xKfR2m7dG5vN9wBcT4yLpQjX1sA6hE3nPq";

interface SoldOutQueueProps {
  onReset: () => void;
}

const SoldOutQueue = ({ onReset }: SoldOutQueueProps) => {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [walletConnected, setWalletConnected] = useState(false);
  const [ticketsAvailable, setTicketsAvailable] = useState(TOTAL_TICKETS);

  const connectWallet = useCallback(() => {
    setWalletConnected(prev => !prev);
  }, []);

  const handleBuy = useCallback(() => {
    setScreen("processing");
  }, []);

  // Simulate ticket countdown during processing
  useEffect(() => {
    if (screen !== "processing") return;

    const interval = setInterval(() => {
      setTicketsAvailable((prev) => {
        const decrease = Math.floor(Math.random() * 300) + 100;
        const next = Math.max(0, prev - decrease);
        if (next === 0) {
          clearInterval(interval);
          setTimeout(() => setScreen("soldout"), 600);
        }
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [screen]);

  const handleClaim = useCallback(() => {
    // Simulate wallet signature
    setTimeout(() => setScreen("reward"), 1200);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <AnimatePresence mode="wait">
        {screen === "lobby" && (
          <SaleLobby
            key="lobby"
            ticketsAvailable={ticketsAvailable}
            totalTickets={TOTAL_TICKETS}
            walletConnected={walletConnected}
            onBuy={handleBuy}
            onConnectWallet={connectWallet}
          />
        )}
        {screen === "processing" && (
          <ProcessingQueue
            key="processing"
            ticketsAvailable={ticketsAvailable}
            totalTickets={TOTAL_TICKETS}
          />
        )}
        {screen === "soldout" && (
          <SoldOut key="soldout" onClaim={handleClaim} />
        )}
        {screen === "reward" && (
          <RewardClaimed key="reward" walletAddress={FULL_WALLET} onReset={onReset} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoldOutQueue;