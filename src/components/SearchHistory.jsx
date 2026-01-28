import { Clock, History } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function SearchHistory({ history, onSelect }) {
    if (!history || history.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 animate-fade-in-up px-4">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <History size={16} />
                <span>최근 분석 기록</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {history.map((term, index) => (
                    <motion.button
                        key={`${term}-${index}`}
                        whileHover={{ scale: 1.05, borderColor: '#6366f1' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(term)}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all duration-200"
                    >
                        <Clock size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                        {term}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

SearchHistory.propTypes = {
    history: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired,
};
