import { motion } from "framer-motion";
import TicketCounter from "@/components/TicketCounter";

interface ProcessingQueueProps {
  ticketsAvailable: number;
  totalTickets: number;
}

const ProcessingQueue = ({ ticketsAvailable, totalTickets }: ProcessingQueueProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Procesando tu compra
          </h1>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary animate-pulse-glow">
            VALIDANDO
          </span>
        </div>

        {/* Spinner */}
        <div className="flex flex-col items-center gap-4 py-6" aria-busy="true" aria-live="polite">
          <div className="relative h-16 w-16">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-muted"
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Tu turno está en proceso. Estamos validando la disponibilidad en la blockchain de Solana.
          </p>
        </div>

        <TicketCounter available={ticketsAvailable} total={totalTickets} />

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Verificando fondos</span>
            <span>Reservando</span>
            <span>Confirmando</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full gradient-sage rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "66%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingQueue;
