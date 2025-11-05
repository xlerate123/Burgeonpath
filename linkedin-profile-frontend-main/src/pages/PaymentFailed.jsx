import React, { useEffect, useState } from "react";

export default function PaymentFailed() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "retry.html"; // Change to your retry page
    }
  }, [seconds]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-sm w-full text-center animate-fadeIn">
        <div className="w-28 h-28 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50 animate-popIn">
          <div className="relative w-10 h-10">
            <span className="absolute left-0 top-1/2 w-10 h-1 bg-red-600 rotate-45 origin-center animate-cross" />
            <span className="absolute left-0 top-1/2 w-10 h-1 bg-red-600 -rotate-45 origin-center animate-cross" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Failed ❌
        </h1>
        <p className="text-gray-600 mb-4">
          Oops! There was an issue processing your payment.
        </p>

        <p className="text-sm font-medium text-gray-700 mb-5">
          Redirecting in <span>{seconds}</span> seconds...
        </p>

        <a
          href="retry.html"
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-red-600 hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300"
        >
          Try Again
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
        @keyframes cross {
          from { width: 0; opacity: 1; }
          to { width: 2.5rem; opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        .animate-popIn { animation: popIn 0.6s ease forwards; }
        .animate-cross { animation: cross 0.8s ease forwards; }
      `}</style>
    </div>
  );
}
