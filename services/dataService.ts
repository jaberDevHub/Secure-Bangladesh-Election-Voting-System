import { VoteRecord, UserProfile } from '../types';
import { getDeviceFingerprint } from './fingerprintService';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get Firebase ID token
const getIdToken = async (): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

export const checkUserStatus = async (uid: string): Promise<{ hasVoted: boolean; votedAt?: number }> => {
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      return { hasVoted: false };
    }

    const response = await fetch(`${API_BASE_URL}/user-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.status === 'voted') {
        return { 
          hasVoted: true, 
          votedAt: new Date(data.data.voted_at).getTime() 
        };
      }
    }
    
    return { hasVoted: false };
  } catch (error) {
    console.error('Error checking user status:', error);
    return { hasVoted: false };
  }
};

export const checkFingerprint = async (): Promise<boolean> => {
   // Returns TRUE if fingerprint is already used
   // This is handled server-side for security, so we return false here
   // The backend will handle the fingerprint validation
   return false;
};

export const castVote = async (user: UserProfile, symbolId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      return { success: false, error: 'Authentication required. Please log in again.' };
    }

    // Map frontend party IDs to backend symbols
    const idToSymbol: Record<string, string> = {
      'bnp': 'ধানের শীষ',
      'jp': 'ঘোড়া', 
      'jamaat': 'দেশমাতৃকার পুত্র',
      'ncp': 'চেয়ার',
      'iab': 'আম',
      'wp': 'হাতুড়ি',
      'jasad': 'মশাল',
      'ksjl': 'গাছ',
      'ldp': 'তারা'
    };

    const backendSymbol = idToSymbol[symbolId];
    if (!backendSymbol) {
      return { success: false, error: 'Invalid party selection' };
    }

    const deviceFingerprint = getDeviceFingerprint();

    const response = await fetch(`${API_BASE_URL}/vote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        symbol: backendSymbol,
        device_fingerprint: deviceFingerprint
      })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Failed to cast vote' 
      };
    }
  } catch (error) {
    console.error('Error casting vote:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const getResults = async () => {
  try {
    // Public endpoint - no authentication required
    const response = await fetch(`${API_BASE_URL}/results`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        // Convert the backend format to frontend format
        const backendResults = data.data.results;
        const results: Record<string, number> = {};
        
        // Convert from backend format [{symbol, total_votes}] to frontend format {partyId: voteCount}
        backendResults.forEach((item: any) => {
          // Map party symbols to party IDs based on backend constants/partySymbols.js
          // These are the actual party symbols used in the backend
          const symbolToId: Record<string, string> = {
            'ধানের শীষ': 'bnp',      // AL symbol
            'ঘোড়া': 'jp',           // BNP symbol  
            'দেশমাতৃকার পুত্র': 'jamaat', // Jatiya Party symbol
            'চেয়ার': 'ldp',
            'আম': 'iab',
            'বই': 'ksjl',
            'মশাল': 'jasad',
            'গাছ': 'ksjl',
            'হাতুড়ি': 'wp',
            'তারা': 'ldp'
          };
          
          const partyId = symbolToId[item.symbol] || item.symbol;
          results[partyId] = item.total_votes;
        });
        
        return { 
          results, 
          total: data.data.total_votes 
        };
      }
    }
    
    // Fallback to empty results if API call fails
    return { results: {}, total: 0 };
  } catch (error) {
    console.error('Error fetching results:', error);
    return { results: {}, total: 0 };
  }
};
