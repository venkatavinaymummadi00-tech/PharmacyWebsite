import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { History, ShieldCheck, User } from 'lucide-react';

export const AuditLogsPage = () => {
  const { auditLogs } = usePharmacy();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-pharmacy-600" /> System Action Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log recording every stock addition, price modification, sale completion, and supplier update.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pharmacy-600" /> {log.user}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-pharmacy-700">{log.action}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{log.entity}</td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
