import { motion } from "framer-motion";
import logo from "@/assets/SoulPoint.png";

// 1. IMPORTAMOS EL BOTÓN MÁGICO DE SOLANA
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Dejo los props aquí para que tu archivo Index.tsx no marque error rojo, 
// aunque ya no los vamos a usar porque el botón nuevo hace todo solito.
interface HeaderProps {
  walletConnected?: boolean;
  walletAddress?: string;
  onConnectWallet?: () => void;
}

const Header = ({ walletConnected, walletAddress, onConnectWallet }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        {/* Aquí mantuve el logo intacto */}
        <img src={logo} alt="SoulPass" className="h-20 w-auto" />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Powered by Solana
        </span>
        
        {/* 2. EL BOTÓN OFICIAL DE PHANTOM */}
        {/* Este componente reemplaza todo el if/else. Hará que se abra la extensión real */}
        <WalletMultiButton className="gradient-sage rounded-lg !bg-primary/20 hover:!bg-primary/30" />
        
      </div>
    </header>
  );
};

export default Header;