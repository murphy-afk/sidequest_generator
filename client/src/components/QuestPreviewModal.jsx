import { FaMapMarkerAlt, FaCheck, FaSyncAlt, FaTimes } from 'react-icons/fa';

export default function QuestPreviewModal({ quest, onClose, onReroll, onAccept }) {
  if (!quest) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <FaTimes />
        </button>

        <div className="absolute top-4 left-6 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase">
          +{quest.xpReward} XP
        </div>

        <div className="text-[10px] uppercase text-amber-400 font-bold mb-1 mt-4">Target Acquired</div>
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <FaMapMarkerAlt className="text-amber-500 text-sm" /> {quest.title}
        </h2>
        <p className="text-slate-300 text-xs mt-3 border-l-2 border-amber-500/40 pl-2">
          {quest.description}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onAccept}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase py-3 transition flex items-center justify-center gap-1 border border-emerald-500"
          >
            <FaCheck /> Accept Quest
          </button>
          <button
            onClick={onReroll}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase py-3 transition border border-slate-700 flex items-center gap-1"
          >
            <FaSyncAlt /> Reroll
          </button>
        </div>
      </div>
    </div>
  );
}