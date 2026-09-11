import { FaMapMarkerAlt, FaCheck, FaSyncAlt } from 'react-icons/fa';

export default function QuestCard({ quest, onComplete, onReroll }) {
  if (!quest) return null;

  return (
    <div className="mt-6 bg-slate-950 border border-amber-500/40 p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase">
        +{quest.xpReward} XP
      </div>
      <div className="text-[10px] uppercase text-amber-400 font-bold mb-1">Target Acquired</div>
      <h2 className="text-lg font-black text-white flex items-center gap-2">
        <FaMapMarkerAlt className="text-amber-500 text-sm" /> {quest.title}
      </h2>
      <p className="text-slate-300 text-xs mt-2 border-l-2 border-amber-500/40 pl-2">
        {quest.description}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onComplete}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase py-2 transition flex items-center justify-center gap-1 border border-emerald-500"
        >
          <FaCheck /> Complete
        </button>
        <button
          onClick={onReroll}
          className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase py-2 transition border border-slate-700 flex items-center gap-1"
        >
          <FaSyncAlt /> Reroll
        </button>
      </div>
    </div>
  );
}