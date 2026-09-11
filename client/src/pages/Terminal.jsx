import { FaWalking, FaHome, FaDiceD20, FaExclamationTriangle } from 'react-icons/fa';

export default function Terminal({
  filters,
  setFilters,
  fetchQuest,
  loading,
  error,
  activeQuest,
  openActiveProgress
}) {
  const handleClick = () => {
    if (activeQuest) {
      openActiveProgress();
    } else {
      fetchQuest();
    }
  };

  return (
    <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative z-10 font-mono">
      <div className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-slate-400">
            Status: <span className="text-amber-400">{filters.canLeaveHouse ? 'Ready to Roam' : 'Homebound'}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFilters({ ...filters, canLeaveHouse: true })}
              className={`py-3 px-4 font-bold text-sm transition flex items-center justify-center gap-2 border ${filters.canLeaveHouse ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
            >
              <FaWalking className="inline" /> Leave House
            </button>
            <button
              type="button"
              onClick={() => setFilters({ ...filters, canLeaveHouse: false })}
              className={`py-3 px-4 font-bold text-sm transition flex items-center justify-center gap-2 border ${!filters.canLeaveHouse ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
            >
              <FaHome className="inline" /> Stay Inside
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs uppercase font-semibold text-slate-400">Challenge Rating</label>
            <span className="text-amber-400 font-bold text-sm">LVL {filters.adventurousness}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={filters.adventurousness}
            onChange={(e) => setFilters({ ...filters, adventurousness: Number(e.target.value) })}
            className="w-full accent-amber-500 bg-slate-800 cursor-pointer h-2"
          />
        </div>

        <div>
          <label className="block text-xs uppercase font-semibold mb-2 text-slate-400">Financial Commitment</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Free ($0)', val: 0 },
              { label: 'Casual ($)', val: 1 },
              { label: 'Expedition ($$)', val: 2 }
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setFilters({ ...filters, budget: item.val })}
                className={`py-2 px-2 text-xs font-bold transition border ${filters.budget === item.val ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800/50 border-slate-700 text-slate-300'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-4 font-black uppercase text-xs tracking-wider transition flex items-center justify-center gap-3 border ${loading
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              : activeQuest
                ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border-emerald-500/50'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
            }`}
        >
          <FaDiceD20 className={`text-lg ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Processing Parameters...' : activeQuest ? 'Active sidequest in progress' : 'Accept a Sidequest'}
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-950/40 border border-red-500/50 p-3 text-red-400 text-xs flex items-center gap-2">
          <FaExclamationTriangle /> {error}
        </div>
      )}
    </div>
  );
}