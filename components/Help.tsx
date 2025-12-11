import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">কিভাবে ভোট দিবেন?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-blue-500 flex items-start gap-4">
          <div className="bg-blue-100 text-blue-700 w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">১</div>
          <div>
            <h3 className="text-xl font-bold mb-2">লগইন করুন</h3>
            <p className="text-gray-600">Google বাটন চেপে আপনার একাউন্টে প্রবেশ করুন।</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-500 flex items-start gap-4">
          <div className="bg-green-100 text-green-700 w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">২</div>
          <div>
            <h3 className="text-xl font-bold mb-2">প্রতীক দেখুন</h3>
            <p className="text-gray-600">পছন্দের মার্কা খুঁজে বের করুন। নামের পাশে বড় ছবি আছে।</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-yellow-500 flex items-start gap-4">
          <div className="bg-yellow-100 text-yellow-700 w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">৩</div>
          <div>
            <h3 className="text-xl font-bold mb-2">ভোট দিন</h3>
            <p className="text-gray-600">মার্কার নিচে "ভোট দিন" বাটনে চাপ দিন।</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-red-500 flex items-start gap-4">
          <div className="bg-red-100 text-red-700 w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold shrink-0">৪</div>
          <div>
            <h3 className="text-xl font-bold mb-2">নিশ্চিত করুন</h3>
            <p className="text-gray-600">পপআপ আসলে "হ্যাঁ" বাটনে চাপ দিলে ভোট হয়ে যাবে।</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-800 text-white p-6 rounded-2xl text-center">
        <p className="text-lg">সাহায্যের জন্য কল করুন: ১৬২২০</p>
        <p className="text-sm opacity-70 mt-2">ডিজিটাল বাংলাদেশ নির্বাচন কমিশন</p>
      </div>
    </div>
  );
};

export default Help;
