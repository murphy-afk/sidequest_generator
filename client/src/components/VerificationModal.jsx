import { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaClock, FaQuestionCircle, FaUpload } from 'react-icons/fa';

export default function VerificationModal({ quest, trackingId, onClose, onSuccess }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizError, setQuizError] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  useEffect(() => {
    if (quest.verification_type === 'timer') {
      setTimeLeft(parseInt(quest.verification_data || '60', 10));
    }
  }, [quest]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleVerify = () => {
    if (quest.verification_type === 'quiz') {
      try {
        const parsedData = JSON.parse(quest.verification_data);
        if (quizAnswer.trim().toLowerCase() !== parsedData.answer.toLowerCase()) {
          setQuizError(true);
          return;
        }
      } catch (e) {
        // Fallback if data is raw string
      }
    }
    onSuccess(trackingId);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <FaTimes />
        </button>

        <h3 className="text-sm uppercase tracking-widest text-amber-400 font-bold mb-2 flex items-center gap-2">
          Objective Verification Required
        </h3>
        <h2 className="text-lg font-black text-white mb-4">{quest.title}</h2>

        {/* TIMER VERIFICATION */}
        {quest.verification_type === 'timer' && (
          <div className="text-center py-6">
            <FaClock className="text-4xl text-amber-500 mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-4">
              {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
            </div>
            {!timerActive ? (
              <button
                onClick={() => setTimerActive(true)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs uppercase"
              >
                Start Timer
              </button>
            ) : (
              <p className="text-xs text-slate-400">Timer running... Remain focused.</p>
            )}
            {timeLeft === 0 && (
              <button
                onClick={handleVerify}
                className="mt-4 w-full py-3 bg-emerald-600 text-slate-950 font-bold text-xs uppercase"
              >
                <FaCheck className="inline" /> Confirm Completion
              </button>
            )}
          </div>
        )}

        {/* QUIZ VERIFICATION */}
        {quest.verification_type === 'quiz' && (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <FaQuestionCircle className="text-amber-500 text-base shrink-0 mt-0.5" />
              <p>{JSON.parse(quest.verification_data || '{}').question || 'Answer the verification prompt:'}</p>
            </div>
            <input
              type="text"
              placeholder="Enter answer..."
              value={quizAnswer}
              onChange={(e) => { setQuizAnswer(e.target.value); setQuizError(false); }}
              className="w-full bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:border-amber-500 outline-none"
            />
            {quizError && <p className="text-red-400 text-[10px]">Incorrect answer. Try again.</p>}
            <button
              onClick={handleVerify}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
            >
              Submit Answer & Complete
            </button>
          </div>
        )}

        {/* PHOTO VERIFICATION */}
        {quest.verification_type === 'photo' && (
          <div className="space-y-4 py-2 text-center">
            <div className="border-2 border-dashed border-slate-700 p-6 bg-slate-950">
              <FaUpload className="text-3xl text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400 mb-2">Upload field evidence photo</p>
              <input
                type="file"
                accept="image/*"
                onChange={() => setPhotoUploaded(true)}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950"
              />
            </div>
            {photoUploaded && (
              <button
                onClick={handleVerify}
                className="w-full py-3 bg-emerald-600 text-slate-950 font-bold text-xs uppercase"
              >
                Upload & Complete Quest
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}