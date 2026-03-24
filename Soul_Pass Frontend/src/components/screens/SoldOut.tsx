import { motion } from "framer-motion";
import { AlertTriangle, Gift } from "lucide-react";

interface SoldOutProps {
  onClaim: () => void;
}

const SoldOut = ({ onClaim }: SoldOutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Sold Out Alert */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15"
        >
          <AlertTriangle className="h-7 w-7 text-accent" aria-hidden="true" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-accent tracking-tight">
          ¡BOLETOS AGOTADOS!
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Lamentamos que no hayas alcanzado boleto en esta ocasión. Valoramos tu tiempo y pasión.
        </p>
      </div>

      {/* Consolation Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl gradient-reward-card p-6 space-y-5"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-terracotta glow-terracotta">
            <Gift className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Beneficio de Consuelo Disponible
            </h2>
            <p className="text-sm text-muted-foreground">
              Como estuviste activo en la fila, eres elegible para un beneficio especial:
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">Acceso prioritario a la siguiente preventa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">10% de descuento garantizado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">Token de lealtad verificado on-chain</span>
          </div>
        </div>

        <button
          onClick={onClaim}
          className="w-full gradient-terracotta rounded-lg px-6 py-3.5 text-base font-medium text-foreground transition-all hover:opacity-90 glow-terracotta focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Reclamar beneficio de consuelo SentiPass"
        >
          Reclamar mi SentiPass (Consuelo)
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SoldOut;
