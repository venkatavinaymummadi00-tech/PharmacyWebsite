import React from 'react';
import { Modal } from '../ui/Modal';
import { HeartPulse, AlertTriangle, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

export const HealthTopicDetailModal = ({ isOpen, onClose, topic }) => {
  if (!topic) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Health Guidance & Educational Reference" maxWidth="max-w-3xl">
      <div className="space-y-6 text-xs text-slate-700">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-900 to-pink-900 text-white rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-rose-500/30 text-rose-200 border border-rose-400/30 rounded-full font-bold text-[10px] uppercase tracking-wider">
              {topic.category}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">{topic.condition}</h2>
          <p className="text-xs text-rose-100/90 mt-1">{topic.overview}</p>
        </div>

        {/* Symptoms & Self Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Common Symptoms
            </h4>
            <ul className="space-y-1.5 pl-1">
              {topic.commonSymptoms.map((sym, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4" /> General Self-Care Guidance
            </h4>
            <p className="text-slate-600 leading-relaxed">{topic.selfCareInfo}</p>
          </div>
        </div>

        {/* OTC Medication Guidance */}
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" /> Over-The-Counter (OTC) Guidance Notice
          </h4>
          <p className="text-teal-950 leading-relaxed">{topic.otcGuidance}</p>
        </div>

        {/* Red Flag Symptoms */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-950">
          <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Red-Flag Symptoms (Seek Immediate Medical Care)
          </h4>
          <ul className="space-y-1 pl-1">
            {topic.redFlagSymptoms.map((rf, i) => (
              <li key={i} className="flex items-start gap-2 text-rose-900 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>{rf}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory Medical Disclaimer */}
        <div className="p-4 bg-slate-100 rounded-xl text-slate-600 border border-slate-200 text-center space-y-1">
          <div className="font-bold text-slate-800 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-500" /> Professional Consultation Disclaimer
          </div>
          <p className="text-[11px]">
            This health information is for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified pharmacist with any questions regarding a medical condition.
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-colors"
          >
            Close Guidance
          </button>
        </div>
      </div>
    </Modal>
  );
};
