import { FaTerminal, FaPause, FaHistory, FaLightbulb, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <nav className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl z-10 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-bold">LVL {user.level || 1}</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-200">{user.username}</span>
        <span className="text-slate-500">({user.xp || 0} XP)</span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={() => setActiveTab('terminal')} className={`px-3 py-1.5 font-bold flex items-center gap-1 transition ${activeTab === 'terminal' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}`}>
          <FaTerminal /> Terminal
        </button>

        <button onClick={() => setActiveTab('paused')} className={`px-3 py-1.5 font-bold flex items-center gap-1 transition ${activeTab === 'paused' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}`}>
          <FaPause /> Archives
        </button>

        <button onClick={() => setActiveTab('history')} className={`px-3 py-1.5 font-bold flex items-center gap-1 transition ${activeTab === 'history' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}`}>
          <FaHistory /> History
        </button>

        <button onClick={() => setActiveTab('suggest')} className={`px-3 py-1.5 font-bold flex items-center gap-1 transition ${activeTab === 'suggest' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-emerald-400 border border-slate-800 hover:bg-emerald-950/30'}`}>
          <FaLightbulb /> Suggest
        </button>

        {user.is_admin ? (
          <button onClick={() => setActiveTab('admin')} className={`px-3 py-1.5 font-bold flex items-center gap-1 transition ${activeTab === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-amber-400 border border-amber-500/50 hover:bg-amber-950/30'}`}>
            <FaShieldAlt /> Admin
          </button>
        ) : null}

        <button onClick={onLogout} className="p-1.5 bg-slate-950 text-red-400 border border-slate-800 hover:bg-red-950/30 transition ml-2" title="Disconnect Session">
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
}