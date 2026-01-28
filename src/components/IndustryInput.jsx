import { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, X, History } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

export default function IndustryInput({ onSearch, disabled, history = [] }) {
    const [industry, setIndustry] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    const maxLength = 50;
    const isValid = industry.length > 0 && industry.length <= maxLength;
    const isTooLong = industry.length > maxLength;

    // Ctrl+K Shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid && !disabled) {
            onSearch(industry.trim());
            setShowDropdown(false);
        }
    };

    const handleSelectHistory = (term) => {
        setIndustry(term);
        onSearch(term);
        setShowDropdown(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-10 relative z-30 font-sans">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                    <div className={`absolute left-5 transition-colors duration-200 ${isFocused ? 'text-blue-500 dark:text-indigo-400' : 'text-slate-400'}`}>
                        <Search size={22} />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        className={`w-full h-14 pl-14 pr-24 bg-white dark:bg-slate-800 border-2 rounded-2xl outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-lg dark:shadow-slate-900/50 transition-all duration-300 
              ${isTooLong ? 'border-red-500 ring-4 ring-red-500/10' :
                                isFocused ? 'border-blue-500/50 dark:border-indigo-500/50 ring-4 ring-blue-500/10 dark:ring-indigo-500/10' :
                                    industry.length > 0 ? 'border-green-500/30 dark:border-green-500/20' : 'border-slate-100 dark:border-slate-700'}`}
                        placeholder="AI, 자동차, 반도체 등 산업명 입력"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        onFocus={() => { setIsFocused(true); setShowDropdown(true); }}
                        onBlur={() => setTimeout(() => { setIsFocused(false); setShowDropdown(false); }, 200)}
                        disabled={disabled}
                    />

                    <div className="absolute right-4 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 text-xs font-bold pointer-events-none">
                        {window.navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
                        <CornerDownLeft size={14} />
                    </div>
                </div>

                {/* Character Count */}
                <div className={`absolute -bottom-6 right-2 text-xs font-medium transition-colors ${isTooLong ? 'text-red-500' : 'text-slate-400 dark:text-slate-600'}`}>
                    {industry.length} / {maxLength}
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {showDropdown && history.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/80 border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                        >
                            <div className="p-2 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between px-4">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <History size={12} /> 최근 검색어
                                </span>
                                <button onClick={() => setShowDropdown(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {history.map((term, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelectHistory(term)}
                                        className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between group"
                                    >
                                        <span>{term}</span>
                                        <Search size={14} className="opacity-0 group-hover:opacity-100 text-blue-500 dark:text-indigo-400 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}

IndustryInput.propTypes = {
    onSearch: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    history: PropTypes.arrayOf(PropTypes.string),
};
