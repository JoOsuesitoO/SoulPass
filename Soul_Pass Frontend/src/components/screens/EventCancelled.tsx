import { motion } from "framer-motion";
import { ShieldAlert, ArrowDownCircle } from "lucide-react";

interface EventCancelledProps {
  ticketPrice: number;
  onClaimRefund: () => void;
}

const EventCancelled = ({ ticketPrice, onClaimRefund }: EventCancelledProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Cancelled Alert */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-terracotta glow-terracotta"
        >
          <ShieldAlert className="h-8 w-8 text-foreground" aria-hidden="true" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-accent tracking-tight">
          EVENTO CANCELADO
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          El organizador ha marcado este evento como <strong className="text-foreground">cancelado</strong>. 
          Pero no te preocupes — tu dinero está protegido.
        </p>
      </div>

      {/* Shield / Refund Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-accent/20 overflow-hidden"
      >
        {/* Shield transformation visual */}
        <div className="gradient-terracotta p-6 space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.6 }}
            >
              <ShieldAlert className="h-10 w-10 text-foreground" aria-hidden="true" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Escudo de Intereses Activado
              </h2>
              <p className="text-sm text-foreground/80">
                El fondo de resiliencia cubre tus comisiones
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 space-y-5">
          <p className="text-sm text-muted-foreground">
            Gracias al fondo acumulado mientras tu dinero estuvo en el escrow de Solana, 
            los intereses generados cubren el <strong className="text-foreground">gas fee</strong> de la transacción de retorno.
          </p>

          <div className="rounded-lg bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Precio del boleto</span>
              <span className="font-bold text-foreground">${ticketPrice.toFixed(2)} USDC</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Comisiones de red</span>
              <span className="font-bold text-primary line-through">$0.12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cubierto por fondo</span>
              <span className="font-bold text-primary">+ $0.12</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-semibold text-foreground">Tu reembolso total</span>
              <span className="text-xl font-extrabold text-primary">${ticketPrice.toFixed(2)} USDC</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 p-3">
            <ArrowDownCircle className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
            <p className="text-xs text-foreground">
              Recibirás <strong>exactamente</strong> la misma cantidad que pagaste. Sin cargos ocultos.
            </p>
          </div>

          <button
            onClick={onClaimRefund}
            className="w-full gradient-terracotta rounded-lg px-6 py-3.5 text-base font-medium text-foreground transition-all hover:opacity-90 glow-terracotta focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Reclamar reembolso total"
          >
            Reclamar Reembolso Total
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventCancelled;
