import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_CONFIG } from './constants';
import Login from './components/Login';
import VotingPage from './components/VotingPage';
import { UserProfile } from './types';
import { castVote, checkUserStatus } from './services/dataService';
import { Home, Info, LogOut, BarChart2, CheckCircle } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import Help from './components/Help';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedAt, setVotedAt] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<'home' | 'help' | 'admin'>('home');
  const [notification, setNotification] = useState<{msg: string, type: 'error' | 'success'} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const u: UserProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || 'Voter',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || ''
        };
        setUser(u);
        
        // Check DB status
        const status = await checkUserStatus(u.uid);
        if (status.hasVoted) {
          setHasVoted(true);
          setVotedAt(status.votedAt);
        }
      } else {
        setUser(null);
        setHasVoted(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // Logic handled in onAuthStateChanged
    } catch (error) {
      console.error("Login failed", error);
      setNotification({ msg: "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", type: 'error' });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPage('home');
  };

  const handleVote = async (symbolId: string) => {
    if (!user) return;
    
    try {
      const result = await castVote(user, symbolId);
      if (result.success) {
        setHasVoted(true);
        setVotedAt(Date.now());
        setNotification({ msg: "আপনার ভোট সফলভাবে গ্রহণ করা হয়েছে!", type: 'success' });
      } else {
        setNotification({ msg: result.error || "ভোট দিতে সমস্যা হয়েছে।", type: 'error' });
      }
    } catch (e) {
      setNotification({ msg: "সার্ভার ত্রুটি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।", type: 'error' });
    }
  };

  // Clear notification after 5s
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
          <p className="text-xl font-bold text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
             <div className="bg-red-600 rounded-full p-2 text-white hidden md:block">
               <span className="font-bold text-lg">BD</span>
             </div>
             <div>
               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-none">ডিজিটাল নির্বাচন</h1>
               <p className="text-xs text-green-600 font-bold tracking-widest">FAIR & FREE</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setPage('help')} 
                className={`p-2 rounded-full hover:bg-gray-100 ${page === 'help' ? 'text-green-600' : 'text-gray-600'}`}
             >
                <Info size={28} />
             </button>
             
             {user ? (
               <div className="flex items-center gap-3">
                 <img src={user.photoURL || "https://picsum.photos/40/40"} alt="User" className="w-10 h-10 rounded-full border-2 border-green-500" />
                 <button onClick={handleLogout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 flex items-center gap-2">
                    <LogOut size={18} />
                    <span className="hidden md:inline">লগআউট</span>
                 </button>
               </div>
             ) : null}
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-down ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
           {notification.type === 'success' ? <CheckCircle /> : <Info />}
           <span className="text-xl font-bold">{notification.msg}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-4">
        {page === 'help' ? (
          <Help />
        ) : page === 'admin' ? (
          <AdminDashboard />
        ) : !user ? (
          <Login onLogin={handleLogin} loading={loading} />
        ) : hasVoted ? (
          <div className="flex flex-col items-center justify-center pt-10 text-center animate-fade-in">
             <div className="bg-white p-10 rounded-3xl shadow-xl max-w-2xl w-full border-t-8 border-green-500">
               <div className="mb-6 bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-green-600">
                 <CheckCircle size={64} />
               </div>
               <h2 className="text-4xl font-bold text-gray-800 mb-4">ধন্যবাদ, {user.name.split(' ')[0]}!</h2>
               <p className="text-2xl text-green-700 font-bold mb-2">✔ আপনি ইতিমধ্যে ভোট দিয়েছেন</p>
               {votedAt && <p className="text-gray-500 mb-8">সময়: {new Date(votedAt).toLocaleString('bn-BD')}</p>}
               
               <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                 <p className="text-xl text-gray-700 mb-4">ভোটের ফলাফল দেখতে ড্যাশবোর্ডে যান</p>
                 <button 
                   onClick={() => setPage('admin')}
                   className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-xl hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 w-full"
                 >
                   <BarChart2 />
                   ফলাফল দেখুন
                 </button>
               </div>
             </div>
          </div>
        ) : (
          <VotingPage onVote={handleVote} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        <p className="font-sans text-sm">
          © 2026 Digital Nirbachon Voting Platform. Secure Digital Democracy.
        </p>
        <p className="text-xs mt-2 opacity-50">
          Built with modern web technologies •
          <a href="http://jaberdevhub.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
            @jaberdevhub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
