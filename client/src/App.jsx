import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Terminal from './pages/Terminal';
import History from './pages/History';
import PausedQuests from './pages/PausedQuests';
import QuestPreviewModal from './components/QuestPreviewModal';
import ActiveQuestModal from './components/ActiveQuestModal';
import VerificationModal from './components/VerificationModal';
import SuggestQuest from './pages/SuggestQuest';
import { useQuests } from './hooks/useQuests';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  const {
    activeTab, setActiveTab,
    completedHistory, pausedList,
    filters, setFilters,
    loading, error,
    previewQuest, setPreviewQuest,
    activeQuest, showActiveModal, setShowActiveModal,
    verificationQuest, setVerificationQuest,
    fetchQuest, acceptQuest, pauseQuest, resumeQuest, verifyAndComplete
  } = useQuests(user, setUser);

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

  if (!user) {
    return (
      <Login authMode={authMode} setAuthMode={setAuthMode} formUsername={formUsername} setFormUsername={setFormUsername} formPassword={formPassword} setFormPassword={setFormPassword} handleAuth={handleAuth} authError={authError} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950 font-mono">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      <Navbar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setUser(null)} />

      <header className="mb-6 text-center relative z-10">
        <h1 className="text-3xl font-black tracking-wider text-slate-100 uppercase">
          Real Life Sidequests
        </h1>
      </header>
      
      {activeTab === 'admin' && user.is_admin && (
        <AdminPanel user={user} />
      )}

      {activeTab === 'terminal' && (
        <Terminal filters={filters} setFilters={setFilters} fetchQuest={fetchQuest} loading={loading} error={error} activeQuest={activeQuest} openActiveProgress={() => setShowActiveModal(true)} />
      )}

      {activeTab === 'paused' && (
        <PausedQuests pausedList={pausedList} onResume={resumeQuest} onOpenVerify={(item) => setVerificationQuest(item)} />
      )}

      {activeTab === 'history' && (
        <History completedHistory={completedHistory} />
      )}

      {activeTab === 'suggest' && (
        <SuggestQuest user={user} />
      )}
      
      {previewQuest && (
        <QuestPreviewModal quest={previewQuest} onClose={() => setPreviewQuest(null)} onReroll={fetchQuest} onAccept={acceptQuest} />
      )}

      {showActiveModal && activeQuest && (
        <ActiveQuestModal quest={activeQuest} onClose={() => setShowActiveModal(false)} onPause={pauseQuest} onVerify={() => {
          setShowActiveModal(false);
          if (activeQuest.verification_type === 'timer') {
            verifyAndComplete(activeQuest.trackingId);
          } else {
            setVerificationQuest(activeQuest);
          }
        }} />
      )}

      {verificationQuest && (
        <VerificationModal quest={verificationQuest} trackingId={verificationQuest.trackingId} onClose={() => setVerificationQuest(null)} onSuccess={verifyAndComplete} />
      )}
    </div>
  );
}