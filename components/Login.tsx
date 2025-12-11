import React from 'react';
import { User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  loading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-green-600 max-w-lg w-full">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-600 p-4 rounded-full text-white animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="m9 12 2 2 4-4"/>
               <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
               <path d="M22 19H2"/>
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif">ডিজিটাল নির্বাচন</h1>
        <p className="text-xl text-green-700 mb-8 font-medium">২০২৬</p>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
          ভোট দিতে নিচে ক্লিক করে<br/>
          <span className="text-blue-600">Google</span> দিয়ে লগইন করুন
        </h2>

        <button 
          onClick={onLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800 font-bold py-6 px-4 rounded-2xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-4 text-2xl"
        >
          {loading ? (
             <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
          ) : (
            <>
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                <path fill="#EA4335" d="M12 4.36c1.6 0 3.06.56 4.23 1.69l3.18-3.18C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google দিয়ে প্রবেশ করুন
            </>
          )}
        </button>
        
        <div className="mt-8 text-gray-600">
           <p className="flex items-center justify-center gap-2">
             <span className="text-3xl text-green-600">🛡️</span> 
             <span>নিরাপদ ও গোপন ভোট</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
