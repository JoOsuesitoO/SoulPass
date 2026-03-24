import { motion } from "framer-motion";
import { QrCode, Shield, Music, Calendar, MapPin } from "lucide-react";

interface MyTicketProps {
  resilienceFund: number;
  onTriggerCancelled: () => void;
  onTriggerCompleted: () => void;
  onTriggerSoldOutQueue: () => void;
}

const MyTicket = ({ resilienceFund, onTriggerCancelled, onTriggerCompleted, onTriggerSoldOutQueue }: MyTicketProps) => {
  const fundReady = resilienceFund >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Ticket Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Ticket Header */}
        <div className="gradient-sage p-5 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-foreground/80" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
                Ticket NFT — Verificado
              </span>
            </div>
            <span className="rounded-full bg-foreground/20 px-3 py-0.5 text-xs font-bold text-foreground">
              VÁLIDO
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Solana Summer Fest 2026
          </h1>
          <div className="flex items-center gap-4 text-sm text-foreground/80">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              28 Ago 2026
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              CDMX
            </span>
          </div>
        </div>

        {/* QR Code Area */}
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="relative rounded-xl border-2 border-dashed border-border p-6 bg-muted/20">
            <QrCode className="h-28 w-28 text-foreground/60" aria-label="Código QR del boleto" />
            <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
              <Shield className="h-4 w-4 text-foreground" aria-hidden="true" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-foreground">Boleto #0042</p>
            <p className="text-xs text-muted-foreground">General Admission — 0.5 SOL</p>
          </div>
        </div>

        {/* Resilience Fund Bar */}
        <div className="px-6 pb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Fondo de Resiliencia
            </span>
            <span className="text-muted-foreground">
              {fundReady ? "Cobertura completa" : "Generando cobertura de red..."}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-sage"
              initial={{ width: "0%" }}
              animate={{ width: `${resilienceFund}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Tu dinero genera intereses en Solana mientras esperas el evento. Este fondo cubre comisiones en caso de cancelación.
          </p>
        </div>
      </div>

      {/* Demo Scenario Triggers */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Demo — Simular escenario
          </p>
          <p className="text-sm text-muted-foreground">
            Selecciona qué sucede con el evento para ver cómo SoulPass protege al fan.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={onTriggerCancelled}
            className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="block text-base font-bold text-accent">Escenario A</span>
            Concierto Cancelado
          </button>
          <button
            onClick={onTriggerCompleted}
            className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="block text-base font-bold text-primary">Escenario B</span>
            Concierto Completado
          </button>
          <button
            onClick={onTriggerSoldOutQueue}
            className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="block text-base font-bold text-orange-600">Escenario C</span>
            Boletos Agotados en Fila
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MyTicket;
