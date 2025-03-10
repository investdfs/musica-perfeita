
import { LogOut } from "lucide-react";
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
      <button
        onClick={onLogout}
        className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default DashboardHeader;
