
import { NavigateFunction } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import MusicPlayerHeader from "@/components/music/MusicPlayerHeader";
import ActionButton from "@/components/music/ActionButton";
import TechnicalDetailsSection from "@/components/music/TechnicalDetailsSection";
import MusicDetailsCard from "@/components/music/MusicDetailsCard";

interface MusicPlayerMainProps {
  musicUrl: string;
  requestData: MusicRequest | null;
  loading: boolean;
  navigate: NavigateFunction;
}

const MusicPlayerMain = ({ 
  musicUrl, 
  requestData, 
  loading, 
  navigate 
}: MusicPlayerMainProps) => {
  return (
    <main className="flex-grow py-12 px-6 bg-gradient-to-b from-gray-900 to-indigo-950">
      <div className="max-w-4xl mx-auto">
        <MusicPlayerHeader />
        
        <div className="mb-8">
          <SoundCloudPlayer 
            musicUrl={musicUrl} 
            limitPlayTime={true} 
            playTimeLimit={40000} 
            isInteractive={false}
          />
        </div>
        
        <ActionButton navigate={navigate} musicRequest={requestData} />
        
        <TechnicalDetailsSection requestData={requestData} />
        
        <MusicDetailsCard requestData={requestData} />
      </div>
    </main>
  );
};

export default MusicPlayerMain;
