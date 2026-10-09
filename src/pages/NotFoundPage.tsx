import React from 'react';
import { ArrowLeft, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
        <Gift size={48} className="animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">404</span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800">
          Oops! This Toy Box is Empty
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          The page or product you were looking for doesn't exist or has been rolled into another toy room.
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
        >
          <span>Browse All Toys</span>
        </Link>
      </div>
    </div>
  );
};
