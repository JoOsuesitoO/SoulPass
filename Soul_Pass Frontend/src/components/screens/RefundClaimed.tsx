import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, ArrowUp, Wallet } from "lucide-react";

interface RefundClaimedProps {
  walletAddress: string;
  amount: number;
  onReset: () => void;
}

const RefundClaimed = ({ walletAddress, amount, onReset }: RefundClaimedProps) => {
  const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Success State */}
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
          ¡REEMBOLSO COMPLETADO!
        </h1>
        <p className="text-muted-foreground">
          Tu dinero ha sido devuelto íntegramente a tu wallet.
        </p>
      </div>

      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
            <Wallet className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wallet {shortAddress}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-extrabold text-foreground">${amount.toFixed(2)} USDC</p>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-0.5 text-sm font-bold text-primary"
              >
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
                +${amount.toFixed(2)}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            En sistemas normales, pierdes dinero en comisiones. En <strong className="text-foreground">SoulPass</strong>, 
            el tiempo que tu dinero estuvo en la blockchain pagó tu propia seguridad.
          </p>
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
      </motion.div>
    </motion.div>
  );
};

export default RefundClaimed;
