import { useState } from 'react';
import { FaLightbulb, FaPaperPlane } from 'react-icons/fa';

export default function SuggestQuest({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('indoors');
  const [budget, setBudget] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/suggest-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title, description, locationType, budget })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSubmitted(true);
      setTitle('');
      setDescription('');
      setBudget(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/50 p-6 shadow-2xl relative z-10 font-mono text-xs">
      <div className="flex items-center gap-2 mb-6">
        <FaLightbulb className="text-emerald-400 text-sm" />
        <h2 className="text-sm uppercase tracking-widest text-emerald-400 font-bold">Propose a Sidequest</h2>
      </div>

      {submitted ? (
        <div className="bg-emerald-950/30 border border-emerald-500 p-4 text-emerald-300 text-center space-y-2">
          <p className="font-bold">Suggestion transmitted to command!</p>
          <p className="text-[10px] text-slate-400">An admin will review your proposal for official database integration.</p>
          <button onClick={() => setSubmitted(false)} className="mt-2 px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold uppercase">
            Submit Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-950/30 border border-red-500 p-2 text-red-400">{error}</div>}

          <div>
            <label className="block text-slate-400 mb-1 uppercase text-[10px]">Sidequest Title</label>
            <input type="text" required placeholder="e.g., Midnight Rooftop Stargazing" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase text-[10px]">Description & Instructions</label>
            <textarea rows={4} required placeholder="Describe what the explorer needs to do..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-emerald-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Location Type</label>
              <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-emerald-500">
                <option value="indoors">Indoors</option>
                <option value="outdoors">Outdoors</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Estimated Budget ($)</label>
              <input type="number" step="0.5" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 outline-none focus:border-emerald-500" />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase py-2.5 flex items-center justify-center gap-2 transition">
            <FaPaperPlane /> Transmit Proposal
          </button>
        </form>
      )}
    </div>
  );
}