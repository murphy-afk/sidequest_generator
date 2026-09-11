import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Terminal from './pages/Terminal';
import History from './pages/History';

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  const [activeTab, setActiveTab] = useState('terminal');
  const [completedHistory, setCompletedHistory] = useState([]);

  const [filters, setFilters] = useState({
    canLeaveHouse: true,
    budget: 0,
    locationType: 'urban',
    adventurousness: 3,
  });

  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formUsername, password: formPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (authMode === 'login') {
        setUser(data.user);
      } else {
        setUser({ id: data.userId, username: formUsername, xp: 0, level: 1 });
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

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

  const completeQuest = async () => {
    if (!quest || !user) return;
    try {
      const res = await fetch('http://localhost:5000/api/complete-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, questId: quest.id, xpReward: quest.xpReward })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser({ ...user, xp: data.newXp, level: data.newLevel });
      alert(`Objective complete! Gained ${quest.xpReward} XP.`);
      setQuest(null);
    } catch (err) {
      alert('Error completing quest: ' + err.message);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/user-history/${user.id}`);
      const data = await res.json();
      if (res.ok) setCompletedHistory(data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  if (!user) {
    return (
      <Login
        authMode={authMode}
        setAuthMode={setAuthMode}
        formUsername={formUsername}
        setFormUsername={setFormUsername}
        formPassword={formPassword}
        setFormPassword={setFormPassword}
        handleAuth={handleAuth}
        authError={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950 font-mono">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none"></div>

      <NavBar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => setUser(null)}
      />

      <header className="mb-6 text-center relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase">
          Real Life Sidequests
        </h1>
      </header>

      {activeTab === 'terminal' ? (
        <Terminal
          filters={filters}
          setFilters={setFilters}
          fetchQuest={fetchQuest}
          loading={loading}
          error={error}
          quest={quest}
          completeQuest={completeQuest}
        />
      ) : (
        <History completedHistory={completedHistory} />
      )}
    </div>
  );
}