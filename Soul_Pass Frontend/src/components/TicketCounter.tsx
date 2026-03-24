import { motion, AnimatePresence } from "framer-motion";

interface TicketCounterProps {
  available: number;
  total: number;
}

const TicketCounter = ({ available, total }: TicketCounterProps) => {
  const percentage = (available / total) * 100;
  const isLow = percentage < 20;

  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-label={`Boletos restantes: ${available} de ${total}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-primary uppercase tracking-wide">
          Boletos restantes
        </span>
        <div className="flex items-baseline gap-1">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={available}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-3xl font-extrabold tabular-nums ${isLow ? "text-accent" : "text-foreground"}`}
            >
              {available.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          <span className="text-muted-foreground font-medium">
            / {total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={available} aria-valuemin={0} aria-valuemax={total}>
        <motion.div
          className={`h-full rounded-full ${isLow ? "gradient-terracotta" : "gradient-sage"}`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Inventario verificado en la blockchain de Solana en tiempo real
      </p>
    </div>
  );
};

export default TicketCounter;
