import { Party } from './types';

export const PARTIES: Party[] = [
  { id: 'bnp', name: 'বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)', symbolName: 'ধানের শীষ', icon: '🌾', color: 'bg-green-600' },
  { id: 'jp', name: 'জাতীয় পার্টি (জাপা)', symbolName: 'লাঙ্গল', icon: '🚜', color: 'bg-yellow-600' },
  { id: 'jamaat', name: 'বাংলাদেশ জামায়াতে ইসলামী', symbolName: 'দাঁড়িপাল্লা', icon: '⚖️', color: 'bg-green-800' },
  { id: 'ncp', name: 'জাতীয় নাগরিক পার্টি (এনসিপি)', symbolName: 'শাপলার কলি', icon: '🌷', color: 'bg-pink-600' },
  { id: 'iab', name: 'ইসলামী আন্দোলন বাংলাদেশ', symbolName: 'হাতপাখা', icon: '🪭', color: 'bg-orange-500' },
  { id: 'wp', name: 'বাংলাদেশের ওয়ার্কার্স পার্টি', symbolName: 'হাতুড়ী', icon: '🔨', color: 'bg-red-600' },
  { id: 'jasad', name: 'জাতীয় সমাজতান্ত্রিক দল-জাসদ', symbolName: 'মশাল', icon: '🔥', color: 'bg-red-500' },
  { id: 'ksjl', name: 'কৃষক শ্রমিক জনতা লীগ', symbolName: 'গামছা', icon: '🧣', color: 'bg-green-700' },
  { id: 'ldp', name: 'লিবারেল ডেমোক্রেটিক পার্টি (এলডিপি)', symbolName: 'ছাতা', icon: '☂️', color: 'bg-blue-600' },
];

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDDtAGKPDMvjYLKptjR8iED7cQrO9rZC2s",
  authDomain: "nirbachon-23a09.firebaseapp.com",
  projectId: "nirbachon-23a09",
  storageBucket: "nirbachon-23a09.firebasestorage.app",
  messagingSenderId: "85337571390",
  appId: "1:85337571390:web:c245cf276b0d13757fd16f"
};

// Admin email for dashboard access (Mock)
export const ADMIN_EMAILS = ['admin@nirbachon.com', 'test@test.com'];
