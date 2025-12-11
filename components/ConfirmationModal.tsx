import React from 'react';
import { Party } from '../types';

interface ConfirmationModalProps {
  party: Party;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ party, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className={`${party.color} p-6 text-center`}>
           <h3 className="text-white text-2xl font-bold">ভোট নিশ্চিতকরণ</h3>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-2xl text-gray-600 mb-4">আপনি কি এই প্রতীকে ভোট দিতে চান?</p>
          
          <div className="bg-gray-100 p-6 rounded-2xl mb-8 flex flex-col items-center border-2 border-gray-200">
            <span className="text-8xl mb-4 transform hover:scale-110 transition duration-300">{party.icon}</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{party.symbolName}</h2>
            <p className="text-xl text-gray-600">{party.name}</p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`w-full py-4 text-3xl font-bold text-white rounded-xl shadow-lg transition transform active:scale-95 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? 'অপেক্ষা করুন...' : 'হ্যাঁ, ভোট দিন'}
            </button>
            
            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full py-4 text-2xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
            >
              না, ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
