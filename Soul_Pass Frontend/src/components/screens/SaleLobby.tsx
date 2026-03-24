import { motion } from "framer-motion";
import TicketCounter from "@/components/TicketCounter";
import eventBanner from "@/assets/event-banner.jpg";

interface SaleLobbyProps {
  ticketsAvailable: number;
  totalTickets: number;
  walletConnected: boolean;
  onBuy: () => void;
  onConnectWallet: () => void;
}

const SaleLobby = ({ ticketsAvailable, totalTickets, walletConnected, onBuy, onConnectWallet }: SaleLobbyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Event Banner */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={eventBanner}
          alt="Festival Solana Summer 2026 — escenario con luces"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">
            28 de Agosto, 2026 • CDMX
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1 tracking-tight">
            Solana Summer Fest 2026
          </h2>
        </div>
      </div>

      {/* Sale Card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Venta General de Boletos
          </h1>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            EN VIVO
          </span>
        </div>

        <TicketCounter available={ticketsAvailable} total={totalTickets} />

        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
          <div>
            <p className="text-sm text-muted-foreground">Precio por boleto</p>
            <p className="text-lg font-bold text-foreground">0.5 SOL</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">≈ USD</p>
            <p className="text-lg font-bold text-foreground">$85.00</p>
          </div>
        </div>

        <button
          onClick={onBuy}
          disabled={!walletConnected}
          className="w-full gradient-sage rounded-lg px-6 py-3.5 text-base font-medium text-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed glow-sage focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          aria-label={walletConnected ? "Comprar boleto" : "Conecta tu wallet para comprar"}
        >
          {walletConnected ? "Comprar Ticket" : "Conecta tu Wallet para comprar"}
        </button>

        <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30">
          <span className="text-sm text-muted-foreground">
            {walletConnected ? "Wallet Conectada" : "Conectar Wallet"}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={walletConnected}
              onChange={onConnectWallet}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default SaleLobby;
