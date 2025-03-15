import React from "react";
import { UserProfile } from "@/types/database.types";

interface DashboardMobileProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const DashboardMobile = ({ userProfile, onLogout }: DashboardMobileProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard (Mobile)
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Bem-vindo(a), {userProfile.name}!
              </h2>
              <p className="text-gray-500">
                Aqui você pode gerenciar suas músicas e informações de perfil.
              </p>
              <button
                onClick={onLogout}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMobile;
