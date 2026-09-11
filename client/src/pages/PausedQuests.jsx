import { FaPause, FaPlay, FaCheck } from 'react-icons/fa';

export default function PausedQuests({ pausedList, onResume, onOpenVerify }) {
  return (
    <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative z-10 font-mono">
      <h2 className="text-sm uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center gap-2">
        <FaPause /> Paused Objectives Archive
      </h2>
      {pausedList.length === 0 ? (
        <p className="text-xs text-slate-500">No paused sidequests currently in storage.</p>
      ) : (
        <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
          {pausedList.map((item) => (
            <div key={item.tracking_id} className="bg-slate-950 border border-slate-800 p-4 text-xs">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-white text-sm">{item.title}</span>
                <span className="text-amber-400">+{item.xp_reward} XP</span>
              </div>
              <p className="text-slate-400 text-xs mb-3">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onResume(item)}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 uppercase flex items-center justify-center gap-1 transition"
                >
                  <FaPlay /> Resume Quest
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}