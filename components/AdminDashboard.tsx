import React, { useEffect, useState } from 'react';
import { getResults } from '../services/dataService';
import { PARTIES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { results: rawResults, total } = await getResults();
      
      const formattedData = PARTIES.map(p => ({
        name: p.symbolName,
        votes: rawResults[p.id] || 0,
        color: p.color.replace('bg-', ''), // Rough mapping, better to have hex codes
        partyName: p.name,
        rawColor: p.color
      })).sort((a, b) => b.votes - a.votes);

      setResults(formattedData);
      setTotalVotes(total);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Map tailwind classes to hex for charts (Approximation)
  const getColor = (twClass: string) => {
    if (twClass.includes('green-600')) return '#16a34a';
    if (twClass.includes('yellow-600')) return '#ca8a04';
    if (twClass.includes('green-800')) return '#166534';
    if (twClass.includes('pink-600')) return '#db2777';
    if (twClass.includes('orange-500')) return '#f97316';
    if (twClass.includes('red-600')) return '#dc2626';
    if (twClass.includes('red-500')) return '#ef4444';
    if (twClass.includes('green-700')) return '#15803d';
    if (twClass.includes('blue-600')) return '#2563eb';
    return '#8884d8';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">নির্বাচন ফলাফল ড্যাশবোর্ড (লাইভ)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
             <p className="text-gray-600 mb-2">মোট ভোট গ্রহণ</p>
             <h3 className="text-5xl font-bold text-blue-600">{totalVotes}</h3>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
             <p className="text-gray-600 mb-2">লিডিং পার্টি</p>
             <h3 className="text-2xl font-bold text-green-700">{results.length > 0 ? results[0].name : '-'}</h3>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
             <p className="text-gray-600 mb-2">ভোটার উপস্থিতি</p>
             <h3 className="text-2xl font-bold text-purple-700">সক্রিয়</h3>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={results}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: '12px', fontWeight: 'bold' }} />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="votes" name="ভোট সংখ্যা" radius={[10, 10, 0, 0]}>
                {results.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.rawColor)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
             <tr>
               <th className="px-6 py-4">প্রতীক</th>
               <th className="px-6 py-4">দলের নাম</th>
               <th className="px-6 py-4 text-right">ভোট</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-xl">{r.name}</td>
                <td className="px-6 py-4">{r.partyName}</td>
                <td className="px-6 py-4 text-right font-bold text-lg">{r.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
