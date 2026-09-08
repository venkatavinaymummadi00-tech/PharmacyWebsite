import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HealthTopicDetailModal } from '../components/health/HealthTopicDetailModal';
import { HeartPulse, ShieldCheck, AlertTriangle, ChevronRight, HelpCircle } from 'lucide-react';

export const HealthInfoPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.getHealthInfo();
      setTopics(res.data || []);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-red-950 p-6 rounded-2xl text-white shadow-xl">
        <span className="px-3 py-1 bg-white/20 text-pink-200 rounded-full font-bold text-xs uppercase tracking-wider">
          Patient Self-Care & Educational Guidance
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
          <HeartPulse className="w-7 h-7 text-pink-300" /> Health Information & Symptom Reference
        </h1>
        <p className="text-xs text-rose-100/90 mt-1 max-w-2xl">
          Safe general self-care information, symptom identification, red-flag warning indicators, and guidance on when professional medical evaluation is required.
        </p>
      </div>

      {/* Mandatory Safety Notice Box */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-teal-900 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-teal-950 text-sm">Important Health & Safety Disclaimer:</strong>
          <p className="leading-relaxed">
            This information is for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Some over-the-counter medicines may help with mild symptoms, but suitability depends on age, medical history, allergies, pregnancy status, current medicines, and other factors. Consult a pharmacist or doctor before using medication.
          </p>
        </div>
      </div>

      {/* Health Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((tp) => (
          <div
            key={tp.id}
            onClick={() => setSelectedTopic(tp)}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 font-extrabold rounded text-[10px] uppercase">
                  {tp.category}
                </span>
                <span className="text-xs text-pharmacy-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Guidance <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-rose-700 transition-colors">
                {tp.condition}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{tp.overview}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-700">Common Symptoms:</div>
              <p className="text-slate-500 truncate">{tp.commonSymptoms.join(' • ')}</p>
            </div>
          </div>
        ))}
      </div>

      <HealthTopicDetailModal
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        topic={selectedTopic}
      />
    </div>
  );
};
