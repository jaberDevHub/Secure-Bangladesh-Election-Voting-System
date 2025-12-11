import React, { useState } from 'react';
import { PARTIES } from '../constants';
import { Party } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { Volume2 } from 'lucide-react';

interface VotingPageProps {
  onVote: (partyId: string) => Promise<void>;
}

const VotingPage: React.FC<VotingPageProps> = ({ onVote }) => {
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCardClick = (party: Party) => {
    setSelectedParty(party);
    speak(`আপনি নির্বাচন করেছেন ${party.symbolName}, ${party.name}`);
  };

  const handleConfirm = async () => {
    if (!selectedParty) return;
    setLoading(true);
    await onVote(selectedParty.id);
    setLoading(false);
    setSelectedParty(null);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const playInstruction = () => {
    speak("ভোট দিতে আপনার পছন্দের প্রতীকের উপরে ক্লিক করুন।");
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md sticky top-20 z-10 border-b-4 border-green-500">
        <h2 className="text-2xl font-bold text-gray-800">পছন্দের প্রতীক বেছে নিন</h2>
        <button 
          onClick={playInstruction}
          className="bg-blue-100 text-blue-700 p-3 rounded-full hover:bg-blue-200 transition"
        >
          <Volume2 size={32} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {PARTIES.map((party) => (
          <div
            key={party.id}
            onClick={() => handleCardClick(party)}
            className="group relative bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-green-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
          >
            <div className={`h-4 w-full ${party.color}`}></div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="text-9xl mb-4 group-hover:scale-110 transition duration-300 filter drop-shadow-md">
                {party.icon}
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{party.symbolName}</h3>
              <p className="text-xl text-gray-600 font-medium leading-tight">{party.name}</p>
              
              <button className="mt-6 bg-green-600 text-white text-xl font-bold py-3 px-8 rounded-full shadow-md group-hover:bg-green-700 transition w-full">
                ভোট দিন
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedParty && (
        <ConfirmationModal
          party={selectedParty}
          onConfirm={handleConfirm}
          onCancel={() => setSelectedParty(null)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default VotingPage;
