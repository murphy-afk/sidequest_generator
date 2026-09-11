import { useState } from 'react';
import { FaTimes, FaCheck, FaQuestionCircle, FaCamera, FaHourglassHalf } from 'react-icons/fa';

export default function VerificationModal({ quest, trackingId, onClose, onSuccess }) {
  if (!quest) return null;

  let verificationData = {};
  try {
    verificationData = typeof quest.verification_data === 'string'
      ? JSON.parse(quest.verification_data)
      : quest.verification_data || {};
  } catch (e) {
    verificationData = {};
  }

  // State for quiz type
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizError, setQuizError] = useState(false);

  // State for photo upload type
  const [selectedFile, setSelectedFile] = useState(null);

  const handleVerifySubmit = (e) => {
    e.preventDefault();

    if (quest.verification_type === 'quiz') {
      if (selectedAnswer === verificationData.correctAnswer) {
        onSuccess(trackingId);
      } else {
        setQuizError(true);
      }
      return;
    }

    if (quest.verification_type === 'photo') {
      if (!selectedFile) {
        alert('Please upload photo proof to complete verification.');
        return;
      }
      onSuccess(trackingId);
      return;
    }

    onSuccess(trackingId);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <FaTimes />
        </button>

        <div className="absolute top-4 left-6 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase">
          Field Checkpoint
        </div>

        <h2 className="text-lg font-black text-white mt-6 mb-2">
          {quest.title}
        </h2>
        <p className="text-slate-300 text-xs mb-6">
          Answer this checkpoint question based on your discovery to verify completion:
        </p>

        {/* 1. QUIZ / DISCOVERY CHECKPOINT */}
        {quest.verification_type === 'quiz' && (
          <div className="space-y-4 mb-6">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-2 leading-relaxed">
              <FaQuestionCircle className="shrink-0" />
              <span>{verificationData.question || 'Answer the following question about your discovery:'}</span>
            </div>
            <div className="space-y-2">
              {verificationData.options && verificationData.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => { setSelectedAnswer(index); setQuizError(false); }}
                  className={`w-full text-left p-3 text-xs border transition ${selectedAnswer === index
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {quizError && (
              <p className="text-red-400 text-xs font-bold">Incorrect answer. Look closer at your surroundings and try again!</p>
            )}
          </div>
        )}

        {/* 2. PHOTO VERIFICATION */}
        {quest.verification_type === 'photo' && (
          <div className="space-y-4 mb-6">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <FaCamera /> {verificationData.prompt || 'Upload photographic proof of your discovery:'}
            </div>
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500 bg-slate-950 p-6 flex flex-col items-center justify-center cursor-pointer transition">
              <FaCamera className="text-slate-500 text-2xl mb-2" />
              <span className="text-xs text-slate-300 font-bold text-center">
                {selectedFile ? selectedFile.name : 'Click to select image file'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>
          </div>
        )}

        {/* 3. TIMER / STANDARD FALLBACK */}
        {quest.verification_type !== 'quiz' && quest.verification_type !== 'photo' && (
          <div className="mb-6 bg-slate-950 border border-slate-800 p-4 text-xs text-slate-400 text-center">
            Click verify below to finalize objective completion.
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleVerifySubmit}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase py-3 transition flex items-center justify-center gap-1 border border-amber-400 cursor-pointer"
          >
            <FaCheck /> Submit Verification
          </button>
        </div>
      </div>
    </div>
  );
}