import React, { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [seconds, setSeconds] = useState(5);
  

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "nextpage.html"; 
    }
  }, [seconds]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-sm w-full text-center animate-fadeIn">
        <div className="w-28 h-28 border-4 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50 animate-popIn">
          <div className="w-12 h-6 border-l-4 border-b-4 border-green-600 rotate-[-45deg] opacity-0 animate-draw" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-4">Your payment has been processed securely.</p>
        <p className="text-sm font-medium text-gray-700 mb-5">
          Redirecting in <span>{seconds}</span> seconds...
        </p>
        <a
          href="nextpage.html"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300"
        >
          Continue
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes draw {
          from { width: 0; height: 0; opacity: 1; }
          to { width: 3rem; height: 1.5rem; opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        .animate-popIn { animation: popIn 0.6s ease forwards; }
        .animate-draw { animation: draw 1s ease forwards 0.4s; }
      `}</style>
    </div>
  );
}