import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Shield, Star } from "lucide-react";

interface BonusClaimedProps {
  walletAddress: string;
  onReset: () => void;
}

const BonusClaimed = ({ walletAddress, onReset }: BonusClaimedProps) => {
  const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Success */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15"
        >
          <CheckCircle className="h-7 w-7 text-primary" aria-hidden="true" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          ¡BONO RECLAMADO!
        </h1>
        <p className="text-muted-foreground">
          Tu recompensa de lealtad ha sido registrada en la blockchain.
        </p>
      </div>

      {/* Loyalty Token Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-xl border border-accent/20"
      >
        <div className="gradient-terracotta p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
              Loyalty Token
            </span>
            <Star className="h-5 w-5 text-foreground/60" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-foreground">
              Fan Leal 2026
            </h2>
            <p className="text-sm text-foreground/80">
              Solana Summer Fest — Asistente Verificado
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2 text-sm text-foreground/70">
            <div>
              <p className="text-xs text-foreground/50">Merch</p>
              <p className="font-bold text-foreground">Descuento</p>
            </div>
            <div className="h-8 w-px bg-foreground/20" aria-hidden="true" />
            <div>
              <p className="text-xs text-foreground/50">Próximo evento</p>
              <p className="font-bold text-foreground">Prioritario</p>
            </div>
            <div className="h-8 w-px bg-foreground/20" aria-hidden="true" />
            <div>
              <p className="text-xs text-foreground/50">Verificado</p>
              <p className="font-bold text-foreground">On-chain</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              Enviado a wallet <strong className="text-foreground">{shortAddress}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://solscan.io/account/${walletAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Ver transacción en Solscan"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Ver en Solscan
            </a>
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              Reiniciar Demo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BonusClaimed;
