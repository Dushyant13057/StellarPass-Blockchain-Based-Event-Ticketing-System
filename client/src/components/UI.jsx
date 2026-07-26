import React from 'react';

export const Loader = ({ label = 'Loading StellarPass data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
        <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-semibold text-slate-400 tracking-wide">{label}</p>
    </div>
  );
};

export const Toast = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div
        className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-bold flex items-center space-x-3 max-w-md ${
          isError
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/30'
            : isSuccess
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30'
            : 'bg-indigo-950/90 text-indigo-200 border-indigo-500/40 shadow-indigo-900/30'
        }`}
      >
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
