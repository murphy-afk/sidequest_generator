import { FaUser, FaHistory, FaCompass, FaSignOutAlt } from 'react-icons/fa';

export default function NavBar({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <div className="w-full max-w-xl mb-4 bg-slate-900 border border-slate-800 p-4 flex justify-between items-center relative z-10 text-xs">
      <div className="flex items-center gap-3">
        <span className="text-amber-400 font-bold flex items-center gap-1"><FaUser className="inline" /> {user.username}</span>
        <span className="bg-slate-800 px-2 py-1 text-slate-300 border border-slate-700">LVL {user.level}</span>
        <span className="text-slate-400">{user.xp} XP</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab(activeTab === 'terminal' ? 'history' : 'terminal')}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1 transition"
        >
          {activeTab === 'terminal' ? <><FaHistory className="inline" /> History</> : <><FaCompass className="inline" /> Terminal</>}
        </button>
        <button
          onClick={() => setActiveTab('paused')}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1 transition"
        >
          Paused
        </button>
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-400 flex items-center gap-1 transition"
        >
          <FaSignOutAlt className="inline" /> Exit
        </button>
      </div>
    </div>
  );
}