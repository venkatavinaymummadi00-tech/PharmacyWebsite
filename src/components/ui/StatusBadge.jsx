import React from 'react';

export const StatusBadge = ({ status }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotStyle = 'bg-slate-400';

  const normalized = (status || '').toLowerCase();

  if (normalized.includes('in stock') || normalized === 'available' || normalized === 'completed' || normalized === 'delivered') {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotStyle = 'bg-emerald-500';
  } else if (normalized.includes('low stock') || normalized === 'pending' || normalized.includes('expiring soon')) {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
    dotStyle = 'bg-amber-500';
  } else if (normalized.includes('out of stock') || normalized === 'expired' || normalized === 'cancelled') {
    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
    dotStyle = 'bg-rose-500';
  } else if (normalized.includes('rx') || normalized.includes('prescription')) {
    badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotStyle = 'bg-indigo-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`}></span>
      {status}
    </span>
  );
};
