import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Terminal from './pages/Terminal';
import History from './pages/History';
import PausedQuests from './pages/PausedQuests';
import QuestPreviewModal from './components/QuestPreviewModal';
import ActiveQuestModal from './components/ActiveQuestModal';
import VerificationModal from './components/VerificationModal';
import SuggestQuest from './pages/SuggestQuest';

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  const [activeTab, setActiveTab] = useState('terminal');
  const [completedHistory, setCompletedHistory] = useState([]);
  const [pausedList, setPausedList] = useState([]);

  const [filters, setFilters] = useState({
    canLeaveHouse: true,
    budget: 0,
    locationType: 'urban',
    adventurousness: 3,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [previewQuest, setPreviewQuest] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [verificationQuest, setVerificationQuest] = useState(null);

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

      setPreviewQuest(data);
    } catch (err) {
      setError(err.message);
      setPreviewQuest(null);
    } finally {
      setLoading(false);
    }
  };

  const acceptQuest = async () => {
    if (!previewQuest || !user) return;
    try {
      const res = await fetch('http://localhost:5000/api/accept-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, questId: previewQuest.id, status: 'active' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const acceptedData = {
        ...previewQuest,
        trackingId: data.trackingId,
        startTime: data.startTime
      };
      setActiveQuest(acceptedData);
      setPreviewQuest(null);
      setShowActiveModal(true);
    } catch (err) {
      alert('Error accepting quest: ' + err.message);
    }
  };

  const pauseQuest = async (currentRemainingSeconds) => {
    if (!activeQuest) return;
    try {
      const res = await fetch('http://localhost:5000/api/pause-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId: activeQuest.trackingId,
          remainingSeconds: currentRemainingSeconds
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setActiveQuest(null);
      setShowActiveModal(false);
      alert('Sidequest paused and moved to archive.');
    } catch (err) {
      alert('Failed to pause quest: ' + err.message);
    }
  };

  const resumeQuest = async (item) => {
    if (activeQuest) {
      alert('Cannot resume quest while another sidequest is currently active!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/resume-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: item.tracking_id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setActiveQuest({
        id: item.id,
        title: item.title,
        description: item.description,
        xpReward: item.xp_reward,
        verification_type: item.verification_type,
        verification_data: item.verification_data,
        trackingId: item.tracking_id,
        startTime: data.startTime
      });

      setActiveTab('terminal');
      setShowActiveModal(true);
    } catch (err) {
      alert('Failed to resume quest: ' + err.message);
    }
  };

  const verifyAndComplete = async (trackingIdToUse) => {
    const targetQuest = activeQuest || verificationQuest;
    if (!targetQuest || !user) return;

    try {
      const res = await fetch('http://localhost:5000/api/verify-and-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId: trackingIdToUse || targetQuest.trackingId || null,
          userId: user.id,
          questId: targetQuest.id,
          xpReward: targetQuest.xpReward
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser({ ...user, xp: data.newXp, level: data.newLevel });
      alert(`Objective verified & complete! Gained ${targetQuest.xpReward} XP.`);

      setActiveQuest(null);
      setShowActiveModal(false);
      setVerificationQuest(null);
    } catch (err) {
      alert('Error verifying quest: ' + err.message);
    }
  };

  const fetchPausedQuests = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/paused-quests/${user.id}`);
      const data = await res.json();
      if (res.ok) setPausedList(data);
    } catch (err) {
      console.error('Failed to load paused quests');
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
    if (activeTab === 'paused') fetchPausedQuests();
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

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