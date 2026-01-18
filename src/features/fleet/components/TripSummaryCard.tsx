
interface TripSummaryProps {
  summary: {
    tripScore: number;
    newGlobalDriverScore: number;
    drowsinessEvents: number;
    distractionEvents: number;
    duration: string;
  };
  onClose: () => void;
}

export const TripSummaryCard = ({ summary, onClose }: TripSummaryProps) => {
  const isExcellent = summary.tripScore >= 80;

  return (
    <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Trip Completed</h3>
        <h2 className="text-3xl font-bold text-white mt-1">Safety Report</h2>
      </div>

      {/* Main Score Display */}
      <div className="flex flex-col items-center justify-center py-6 bg-slate-900/50 rounded-2xl border border-slate-700 mb-8">
        <span className={`text-6xl font-black ${isExcellent ? 'text-green-400' : 'text-orange-400'}`}>
          {Math.round(summary.tripScore)}%
        </span>
        <p className="text-slate-500 text-xs mt-2 uppercase font-bold">Overall Safety Grade</p>
      </div>

      {/* Incident Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-slate-700/30 rounded-2xl border border-slate-700">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Drowsiness</p>
          <p className="text-2xl font-bold text-white">{summary.drowsinessEvents}</p>
        </div>
        <div className="p-4 bg-slate-700/30 rounded-2xl border border-slate-700">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Distractions</p>
          <p className="text-2xl font-bold text-white">{summary.distractionEvents}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm px-2">
            <span className="text-slate-400">Driver Global Score</span>
            <span className="text-white font-mono">{Math.round(summary.newGlobalDriverScore)}%</span>
        </div>
        <div className="flex justify-between items-center text-sm px-2">
            <span className="text-slate-400">Total Duration</span>
            <span className="text-white font-mono">{summary.duration}</span>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
};