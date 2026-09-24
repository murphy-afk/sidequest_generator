import { useState, useEffect } from 'react';

export function useQuests(user, setUser) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [completedHistory, setCompletedHistory] = useState([]);
  const [pausedList, setPausedList] = useState([]);
  const [filters, setFilters] = useState({ canLeaveHouse: true, budget: 0, locationType: 'urban', adventurousness: 3 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewQuest, setPreviewQuest] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [verificationQuest, setVerificationQuest] = useState(null);

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

      setActiveQuest({ ...previewQuest, trackingId: data.trackingId, startTime: data.startTime });
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
        body: JSON.stringify({ trackingId: activeQuest.trackingId, remainingSeconds: currentRemainingSeconds })
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

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'paused') {
      fetch(`http://localhost:5000/api/paused-quests/${user.id}`)
        .then(res => res.json())
        .then(data => setPausedList(data))
        .catch(() => console.error('Failed to load paused quests'));
    }
    if (activeTab === 'history') {
      fetch(`http://localhost:5000/api/user-history/${user.id}`)
        .then(res => res.json())
        .then(data => setCompletedHistory(data))
        .catch(() => console.error('Failed to load history'));
    }
  }, [activeTab, user]);

  return {
    activeTab, setActiveTab,
    completedHistory, pausedList,
    filters, setFilters,
    loading, error,
    previewQuest, setPreviewQuest,
    activeQuest, showActiveModal, setShowActiveModal,
    verificationQuest, setVerificationQuest,
    fetchQuest, acceptQuest, pauseQuest, resumeQuest, verifyAndComplete
  };
}