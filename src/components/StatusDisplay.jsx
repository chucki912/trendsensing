import { AlertCircle, RotateCcw } from 'lucide-react';
import PropTypes from 'prop-types';

export default function StatusDisplay({ loading, error, onRetry }) {
    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-8 py-10">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
                        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-6"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full"></div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-4/6"></div>
                        </div>
                        <div className="mt-8 flex gap-2">
                            <div className="h-6 bg-slate-100 dark:bg-slate-700 round-full w-20 rounded-full"></div>
                            <div className="h-6 bg-slate-100 dark:bg-slate-700 round-full w-20 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-lg mx-auto py-20 px-4 animate-fade-in-up">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-10 text-center shadow-xl dark:shadow-red-900/10">
                    <div className="inline-flex p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">데이터 분석 오류</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        {error}
                    </p>
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
                    >
                        <RotateCcw size={20} />
                        다시 시도하기
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

StatusDisplay.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.string,
    onRetry: PropTypes.func,
};
