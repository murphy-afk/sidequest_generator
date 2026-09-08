import { useState } from 'react';
import { 
  FaCompass, 
  FaWalking, 
  FaHome, 
  FaChartLine, 
  FaCoins, 
  FaDiceD20, 
  FaMapMarkerAlt, 
  FaCheck, 
  FaSyncAlt, 
  FaExclamationTriangle 
} from 'react-icons/fa';

function App() {
  const [filters, setFilters] = useState({
    canLeaveHouse: true,
    budget: 0,
    locationType: 'urban',
    adventurousness: 3,
  });

  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch quest');
      setQuest(data);
    } catch (err) {
      setError(err.message);
      setQuest(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950 font-mono">

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <header className="mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs tracking-widest uppercase mb-3">
          <FaCompass className="inline" /> Tactical Directive Terminal v1.0
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-wider text-slate-100 uppercase flex items-center justify-center gap-3">
          Real Life Sidequests
        </h1>
        <p className="text-slate-400 text-sm mt-2 tracking-wide">Break the monotony</p>
      </header>

      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl relative z-10 backdrop-blur-md">
        <div className="absolute -top-3 left-6 px-3 bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-800 rounded">
          Control Panel
        </div>

        <div className="space-y-6 mt-2">

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-slate-400 flex items-center gap-2">
              Status: <span className="text-amber-400">{filters.canLeaveHouse ? 'Ready to Roam' : 'Homebound'}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFilters({ ...filters, canLeaveHouse: true })}
                className={`py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 border ${
                  filters.canLeaveHouse 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}>
                <FaWalking className="inline" /> Leave House
              </button>
              <button
                onClick={() => setFilters({ ...filters, canLeaveHouse: false })}
                className={`py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 border ${
                  !filters.canLeaveHouse 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}>
                <FaHome className="inline" /> Stay Inside
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-2">
                <FaChartLine className="inline" /> Challenge Rating
              </label>
              <span className="text-amber-400 font-bold text-sm">LVL {filters.adventurousness}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={filters.adventurousness}
              onChange={(e) => setFilters({ ...filters, adventurousness: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 cursor-pointer h-2 rounded-lg"/>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase">
              <span>Low Risk</span>
              <span>Moderate</span>
              <span>Wildcard</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-slate-400 flex items-center gap-2">
              <FaCoins className="inline" /> Financial Commitment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Free ($0)', val: 0 },
                { label: 'Casual ($)', val: 1 },
                { label: 'Expedition ($$)', val: 2 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setFilters({ ...filters, budget: item.val })}
                  className={`py-2 px-2 text-xs rounded-lg font-bold transition border ${
                    filters.budget === item.val
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>


          <button
            onClick={fetchQuest}
            disabled={loading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-3 disabled:opacity-50">
            <FaDiceD20 className={`text-xl ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Processing Parameters...' : 'Accept a Sidequest'}
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-xl mt-4 bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-red-400 text-xs flex items-center gap-3 relative z-10">
          <FaExclamationTriangle className="text-lg shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {quest && (
        <div className="w-full max-w-xl mt-6 bg-slate-900 border border-amber-500/40 rounded-xl p-6 shadow-2xl relative z-10 animate-fade-in overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-lg uppercase">
            +{quest.xpReward} XP
          </div>
          <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-1">
            Quest Log // Target Acquired
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FaMapMarkerAlt className="text-amber-500 text-sm" /> {quest.title}
          </h2>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed border-l-2 border-amber-500/40 pl-3">
            {quest.description}
          </p>
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => alert("Objective complete! Experience points added.")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition flex items-center justify-center gap-2">
              <FaCheck className="inline" /> Confirm Completion
            </button>
            <button 
              onClick={fetchQuest}
              className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition border border-slate-700 flex items-center gap-2">
              <FaSyncAlt className="inline" /> Reroll
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;