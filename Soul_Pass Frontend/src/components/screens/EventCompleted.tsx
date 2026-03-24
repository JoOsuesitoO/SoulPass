import { motion } from "framer-motion";
import { PartyPopper, Gift, Shield } from "lucide-react";

interface EventCompletedProps {
  onClaimBonus: () => void;
}

const EventCompleted = ({ onClaimBonus }: EventCompletedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Completed State */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15"
        >
          <PartyPopper className="h-8 w-8 text-primary" aria-hidden="true" />
        </motion.div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            Evento Finalizado
          </p>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            ¡Gracias por asistir!
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Tu ticket NFT ha cambiado a estado <strong className="text-primary">ASISTIDO</strong>. 
          El organizador ha marcado el evento como finalizado exitosamente.
        </p>
      </div>

      {/* Loyalty Bonus Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl gradient-reward-card p-6 space-y-5"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-terracotta glow-terracotta">
            <Gift className="h-6 w-6 text-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Bono de Lealtad Disponible
            </h2>
            <p className="text-sm text-muted-foreground">
              Los intereses generados por tu espera se han convertido en una recompensa:
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted-foreground">Fondo de Resiliencia → Convertido a</p>
              <p className="text-sm font-bold text-foreground">Bono de Lealtad</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Cupón de descuento para merchandising oficial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Acceso prioritario al próximo evento del artista</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Token de lealtad verificado on-chain</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
          <p className="text-xs text-foreground">
            Los intereses sobrantes del escrow se depositan en la <strong>Pool de Lealtad</strong>, 
            generando beneficios para los fans que realmente asistieron.
          </p>
        </div>

        <button
          onClick={onClaimBonus}
          className="w-full gradient-sage rounded-lg px-6 py-3.5 text-base font-medium text-foreground transition-all hover:opacity-90 glow-sage focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Reclamar bono de lealtad"
        >
          Reclamar mi Bono de Lealtad
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EventCompleted;
