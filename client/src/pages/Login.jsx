export default function Login({
  authMode,
  setAuthMode,
  formUsername,
  setFormUsername,
  formPassword,
  setFormPassword,
  handleAuth,
  authError
}) {
  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        {/* Visual badge indicator that changes styling based on mode */}
        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isLogin ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}>
          {isLogin ? 'Security Clearance' : 'New Operative Record'}
        </div>

        <div className="text-center mb-6 mt-2">
          <h1 className={`text-2xl font-black uppercase ${isLogin ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isLogin ? 'Terminal Access' : 'Create Profile'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Authenticate to track field objectives.' : 'Register a new profile in the database.'}
          </p>
        </div>

        {authError && (
          <div className="mb-4 bg-red-950/40 border border-red-500/50 p-3 text-red-400 text-xs">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Codename (Username)</label>
            <input
              type="text"
              value={formUsername}
              onChange={(e) => setFormUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 focus:border-amber-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Passcode</label>
            <input
              id="password"
              type="password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 focus:border-amber-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 font-black uppercase text-xs tracking-wider transition border ${isLogin
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
              : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-emerald-500'
              }`}
          >
            {isLogin ? 'Initialize Session' : 'Register Operative'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
            className="text-xs text-slate-400 hover:text-amber-400 underline"
          >
            {isLogin ? 'Need an account? Register here.' : 'Already have an account? Login.'}
          </button>
        </div>
      </div>
    </div>
  );
}