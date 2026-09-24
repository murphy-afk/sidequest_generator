import { useState } from 'react';
import { FaLightbulb, FaCheck } from 'react-icons/fa';

export default function SuggestQuest({ user }) {
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('indoors');
  const [budget, setBudget] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/suggest-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, description, locationType, budget })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSubmitted(true);
      setDescription('');
      setBudget(0);
    } catch (err) {
      alert('Error submitting suggestion: ' + err.message);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 shadow-2xl relative z-10 font-mono text-xs">
      <h2 className="text-sm uppercase tracking-widest text-emerald-400 font-bold mb-4 flex items-center gap-2">
        <FaLightbulb /> Suggest a Sidequest
      </h2>

      {submitted ? (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 text-center text-emerald-300">
          Suggestion submitted successfully. Thank you for contributing to the archives!
          <button onClick={() => setSubmitted(false)} className="mt-4 block mx-auto underline text-xs">Submit another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1 uppercase text-[10px]">Quest Description / Concept</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Describe the real-world discovery or activity..." className="w-full bg-slate-950 border border-slate-800 p-3 text-slate-100 focus:border-emerald-500 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Environment</label>
              <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 text-slate-100 focus:border-emerald-500 outline-none">
                <option value="indoors">Indoors</option>
                <option value="outdoors">Outdoors</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Estimated Budget ($)</label>
              <input type="number" min="0" step="0.5" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 text-slate-100 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold uppercase py-3 transition flex items-center justify-center gap-1">
            <FaCheck /> Transmit Suggestion
          </button>
        </form>
      )}
    </div>
  );
}