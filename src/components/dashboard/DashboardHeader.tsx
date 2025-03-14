
import { UserProfile } from "@/types/database.types";

interface DashboardHeaderProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const DashboardHeader = ({ userProfile, onLogout }: DashboardHeaderProps) => {
  if (!userProfile) return null;
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">
        Olá, <span className="text-pink-500">{userProfile.name}</span>! Crie sua música perfeita!
      </h1>
      {/* Botão SAIR removido conforme solicitado */}
    </div>
  );
};

export default DashboardHeader;
