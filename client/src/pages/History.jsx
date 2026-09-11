import { FaHistory } from 'react-icons/fa';

export default function History({ completedHistory }) {
  return (
    <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative z-10">
      <h2 className="text-sm uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center gap-2">
        <FaHistory /> Completed Quest Log
      </h2>
      {completedHistory.length === 0 ? (
        <p className="text-xs text-slate-500">No completed objectives found in archive.</p>
      ) : (
        <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
          {completedHistory.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-3 text-xs">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-white">{item.title}</span>
                <span className="text-amber-400">+{item.xp_reward} XP</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">{item.description}</p>
              <span className="text-[10px] text-slate-600">Completed: {new Date(item.completed_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}