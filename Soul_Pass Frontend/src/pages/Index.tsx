import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import MyTicket from "@/components/screens/MyTicket";
import EventCancelled from "@/components/screens/EventCancelled";
import RefundClaimed from "@/components/screens/RefundClaimed";
import EventCompleted from "@/components/screens/EventCompleted";
import BonusClaimed from "@/components/screens/BonusClaimed";
import SoldOutQueue from "@/components/screens/SoldOutQueue";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";

import idl from "../idl/idl.json";


type Screen = "ticket" | "cancelled" | "refunded" | "completed" | "bonus" | "soldout-queue";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
//const FAKE_WALLET = "8xKf...3nPq";
//const FULL_WALLET = "8xKfR2m7dG5vN9wBcT4yLpQjX1sA6hE3nPq";
const TICKET_PRICE = 85.0;

const Index = () => {

  // --- CONFIGURACIÓN DE SOLANA ---
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();

  // Llave del evento
  const EVENT_PUBLIC_KEY = new web3.PublicKey("YSJEfZNVBJu7RD18joAbki8HsUq1dBGN7BZK38um5R2");

  const getProgram = () => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return new Program(idl as any, provider);
  };
  // -------------------------------

  const [screen, setScreen] = useState<Screen>("ticket");
  //const [walletConnected, setWalletConnected] = useState(true);
  const [resilienceFund, setResilienceFund] = useState(0);

  // Simulate resilience fund growing
  useEffect(() => {
    if (screen !== "ticket") return;
    const interval = setInterval(() => {
      setResilienceFund((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 3 + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [screen]);

  const handleScenarioA = useCallback(() => {
    setScreen("cancelled");
  }, []);

  const handleScenarioB = useCallback(() => {
    setScreen("completed");
  }, []);

  const handleScenarioC = useCallback(() => {
    setScreen("soldout-queue");
  }, []);

  const handleClaimRefund = useCallback(() => {
    setTimeout(() => setScreen("refunded"), 1200);
  }, []);

  const handleClaimBonus = useCallback(() => {
    setTimeout(() => setScreen("bonus"), 1200);
  }, []);

  const handleReset = useCallback(() => {
    setScreen("ticket");
    setResilienceFund(0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col gradient-charcoal">
      <Header
        walletConnected={connected}
        walletAddress={publicKey ? publicKey.toBase58() : ""}
        onConnectWallet={() => {}}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8" role="main">
        <AnimatePresence mode="wait">
          {screen === "ticket" && (
            <MyTicket
              key="ticket"
              resilienceFund={Math.min(resilienceFund, 100)}
              onTriggerCancelled={handleScenarioA}
              onTriggerCompleted={handleScenarioB}
              onTriggerSoldOutQueue={handleScenarioC}
            />
          )}
          {screen === "cancelled" && (
            <EventCancelled
              key="cancelled"
              ticketPrice={TICKET_PRICE}
              onClaimRefund={handleClaimRefund}
            />
          )}
          {screen === "refunded" && (
            <RefundClaimed
              key="refunded"
              walletAddress={publicKey?.toBase58() || ""}
              amount={TICKET_PRICE}
              onReset={handleReset}
            />
          )}
          {screen === "completed" && (
            <EventCompleted
              key="completed"
              onClaimBonus={handleClaimBonus}
            />
          )}
          {screen === "bonus" && (
            <BonusClaimed
              key="bonus"
              walletAddress={publicKey?.toBase58() || ""}
              onReset={handleReset}
            />
          )}
          {screen === "soldout-queue" && (
            <SoldOutQueue
              key="soldout-queue"
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        Protegido por escrows automáticos en Solana • Tu dinero está seguro hasta la confirmación del evento
      </footer>
    </div>
  );
};

export default Index;
