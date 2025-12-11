export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface VoteRecord {
  symbol: string;
  timestamp: number;
}

export interface Party {
  id: string;
  name: string; // Bangla Name
  symbolName: string; // Bangla Symbol Name
  icon: string; // Emoji or placeholder for the symbol
  color: string;
}

export interface FingerprintData {
  userAgent: string;
  screenRes: string;
  timezone: string;
  platform: string;
  hardwareConcurrency: number;
}
