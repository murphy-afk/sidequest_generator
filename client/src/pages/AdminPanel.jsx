import { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheck, FaPlus } from 'react-icons/fa';

export default function AdminPanel({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('suggestions');
  const [suggestions, setSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    xpReward: 50,
    canLeaveHouse: 0,
    budget: 0,
    adventurousness: 2,
    locationType: 'indoors',
    verificationType: 'timer',
    verificationData: '{"durationMinutes": 10}'
  });

  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/suggestions');
      const data = await res.json();
      if (res.ok) setSuggestions(data);
    } catch (err) {
      console.error('Failed to load suggestions');
    }
  };

  useEffect(() => {
    if (activeSubTab === 'suggestions') fetchSuggestions();
  }, [activeSubTab]);

  const handleSelectSuggestion = (s) => {
    setSelectedSuggestionId(s.id);
    setFormData({
      title: s.title || 'Discovered Objective',
      description: s.description,
      xpReward: 50,
      canLeaveHouse: s.location_type === 'outdoors' ? 1 : 0,
      budget: s.budget,
      adventurousness: 2,
      locationType: s.location_type,
      verificationType: 'timer',
      verificationData: '{"durationMinutes": 10}'
    });
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/approve-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId: selectedSuggestionId, ...formData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Suggestion approved and added to quest database!');
      setSelectedSuggestionId(null);
      fetchSuggestions();
    } catch (err) {
      alert('Error approving suggestion: ' + err.message);
    }
  };

  const handleDirectCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/create-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('New quest successfully added!');
      setFormData({
        title: '', description: '', xpReward: 50, canLeaveHouse: 0,
        budget: 0, adventurousness: 2, locationType: 'indoors',
        verificationType: 'timer', verificationData: '{"durationMinutes": 10}'
      });
    } catch (err) {
      alert('Error creating quest: ' + err.message);
    }
  };

  if (!user || !user.is_admin) {
    return <div className="text-red-500 font-mono text-xs text-center p-8">Access Denied: Admin Clearance Required</div>;
  }

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-amber-500 p-6 shadow-2xl relative z-10 font-mono text-xs">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
          <FaShieldAlt /> Command Admin Panel
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setActiveSubTab('suggestions')} className={`px-3 py-1 font-bold ${activeSubTab === 'suggestions' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
            Review Suggestions
          </button>
          <button onClick={() => { setActiveSubTab('create'); setSelectedSuggestionId(null); }} className={`px-3 py-1 font-bold ${activeSubTab === 'create' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
            Add New Quest
          </button>
        </div>
      </div>

      {activeSubTab === 'suggestions' && !selectedSuggestionId && (
        <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
          {suggestions.length === 0 ? (
            <p className="text-slate-500">No pending suggestions found.</p>
          ) : (
            suggestions.map((s) => (
              <div key={s.id} className="bg-slate-950 border border-slate-800 p-4 flex justify-between items-start">
                <div>
                  <div className="text-slate-400 text-[10px] mb-1">Suggested by User #{s.user_id} ({s.username})</div>
                  <p className="text-slate-200 mb-2">{s.description}</p>
                  <div className="flex gap-4 text-[10px] text-amber-400">
                    <span>Type: {s.location_type}</span>
                    <span>Budget: ${s.budget}</span>
                  </div>
                </div>
                <button onClick={() => handleSelectSuggestion(s)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 uppercase shrink-0">
                  Review & Approve
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {(activeSubTab === 'create' || selectedSuggestionId) && (
        <form onSubmit={selectedSuggestionId ? handleApproveSubmit : handleDirectCreate} className="space-y-4">
          <div className="text-amber-400 font-bold border-b border-amber-500/30 pb-2">
            {selectedSuggestionId ? 'Approve & Finalize Suggestion Elements' : 'Create Direct Quest Element'}
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase text-[10px]">Quest Title</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase text-[10px]">Description</label>
            <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500 resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">XP Reward</label>
              <input type="number" value={formData.xpReward} onChange={(e) => setFormData({ ...formData, xpReward: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Adventurousness (1-5)</label>
              <input type="number" min="1" max="5" value={formData.adventurousness} onChange={(e) => setFormData({ ...formData, adventurousness: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Budget ($)</label>
              <input type="number" step="0.5" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Location Type</label>
              <select value={formData.locationType} onChange={(e) => setFormData({ ...formData, locationType: e.target.value, canLeaveHouse: e.target.value === 'outdoors' ? 1 : 0 })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500">
                <option value="indoors">Indoors</option>
                <option value="outdoors">Outdoors</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Verification Type</label>
              <select value={formData.verificationType} onChange={(e) => setFormData({ ...formData, verificationType: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500">
                <option value="timer">Timer</option>
                <option value="quiz">Quiz / Checkpoint</option>
                <option value="photo">Photo Upload</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase text-[10px]">Verification Data (JSON)</label>
            <input type="text" value={formData.verificationData} onChange={(e) => setFormData({ ...formData, verificationData: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-amber-500 text-[11px]" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase py-2 transition">
              {selectedSuggestionId ? 'Authorize & Publish Quest' : 'Save New Quest'}
            </button>
            {selectedSuggestionId && (
              <button type="button" onClick={() => setSelectedSuggestionId(null)} className="px-4 bg-slate-800 text-slate-300 font-bold uppercase py-2">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}