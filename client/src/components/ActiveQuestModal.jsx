import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPause, FaCheck, FaTimes, FaHourglassHalf } from 'react-icons/fa';

export default function ActiveQuestModal({ quest, onClose, onPause, onVerify }) {
  if (!quest) return null;

  let totalDurationSecs = 60;
  try {
    if (typeof quest.verification_data === 'string' && quest.verification_data.trim().startsWith('{')) {
      const parsed = JSON.parse(quest.verification_data);
      totalDurationSecs = parseInt(parsed.durationSeconds || parsed.durationMinutes * 60 || 60, 10);
    } else if (quest.verification_data) {
      totalDurationSecs = parseInt(quest.verification_data, 10);
    }
  } catch (e) {
    totalDurationSecs = 60;
  }


  const [timeLeft, setTimeLeft] = useState(() => {
    if (quest.verification_type !== 'timer') return 0;
    const startTimeMs = quest.startTime ? new Date(quest.startTime).getTime() : Date.now();
    const elapsedSecs = Math.floor((Date.now() - startTimeMs) / 1000);
    return Math.max(0, totalDurationSecs - elapsedSecs);
  });

  useEffect(() => {
    if (quest.verification_type !== 'timer') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quest.verification_type]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const isTimerComplete = quest.verification_type === 'timer' ? timeLeft === 0 : true;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <FaTimes />
        </button>

        <div className="absolute top-4 left-6 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase">
          Sidequest in Progress (+{quest.xpReward} XP)
        </div>

        <div className="text-[10px] uppercase text-emerald-400 font-bold mb-1 mt-4">Active Operation</div>
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <FaMapMarkerAlt className="text-emerald-500 text-sm" /> {quest.title}
        </h2>
        <p className="text-slate-300 text-xs mt-3 border-l-2 border-emerald-500/40 pl-2">
          {quest.description}
        </p>

        {quest.verification_type === 'timer' && (
          <div className="mt-4 bg-slate-950 border border-emerald-500/30 p-3 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 mb-1">
              <FaHourglassHalf className="text-emerald-400 animate-pulse" /> Timer Countdown
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <button
            onClick={onVerify}
            disabled={!isTimerComplete}
            className={`flex-1 font-bold text-xs uppercase py-3 transition flex items-center justify-center gap-1 border ${isTimerComplete
              ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-emerald-500 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              }`}
          >
            <FaCheck /> {isTimerComplete ? 'Complete & Verify' : 'Timer Running...'}
          </button>
          <button
            onClick={() => onPause(timeLeft)}
            className="px-4 bg-amber-950/40 hover:bg-amber-900/50 text-amber-400 font-bold text-xs uppercase py-3 transition border border-amber-500/40 flex items-center gap-1"
          >
            <FaPause /> Pause
          </button>
        </div>
      </div>
    </div>
  );
}