// Predefined party symbols for Bangladesh election 2026
export const PARTY_SYMBOLS = [
  'ধানের শীষ',      // AL (Awami League)
  'ঘোড়া',          // BNP (Bangladesh Nationalist Party)  
  'দেশমাতৃকার পুত্র', // Jatiya Party
  'চেয়ার',         // LDP
  'আম',             // Independent/BJP
  'বই',             // Progressive Alliance
  'মশাল',          // Gonoforum
  'গাছ',           // Environmental Party
  'হাতুড়ি',        // Workers Party
  'তারা'           // National Democratic Party
];

// Helper function to validate party symbol
export const isValidSymbol = (symbol) => {
  return PARTY_SYMBOLS.includes(symbol);
};

// Export party symbols as a Set for faster lookup
export const VALID_SYMBOLS_SET = new Set(PARTY_SYMBOLS);