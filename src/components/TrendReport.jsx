import { useState, useEffect } from 'react';
import { Calendar, Hash, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const TrendCard = ({ content, index, onKeywordClick, isDark }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!content) return null;

    const lines = content.trim().split('\n');
    const title = lines[0].replace(/^\d+\.\s*/, '');
    const bodyLines = lines.slice(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, boxShadow: isDark ? "0px 20px 40px rgba(0, 0, 0, 0.4)" : "0px 20px 40px rgba(0, 0, 0, 0.05)" }}
            className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow-lg dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 border-l-8 border-l-blue-500 dark:border-l-indigo-600 overflow-hidden transition-all duration-300 pointer-events-auto"
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-8 md:p-10 cursor-pointer flex justify-between items-start gap-4"
            >
                <div className="flex-grow">
                    <h4 className={`text-xl font-bold transition-colors ${isExpanded ? 'text-blue-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {title}
                    </h4>
                    {!isExpanded && bodyLines.length > 0 && (
                        <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 text-sm leading-relaxed">
                            {bodyLines[0]}
                        </p>
                    )}
                </div>
                <div className={`p-2 rounded-full bg-slate-50 dark:bg-slate-700/50 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-500 dark:text-indigo-400' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 md:px-10 pb-10 pt-2 border-t border-slate-50 dark:border-slate-700/50">
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 font-sans text-lg">
                                {bodyLines.map((line, lIdx) => {
                                    const parts = line.split(/(\[.*?\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+|(?:#\S+))/g);

                                    return (
                                        <div key={lIdx} className="break-words">
                                            {parts.map((part, pIdx) => {
                                                const mdMatch = part.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
                                                if (mdMatch) {
                                                    return (
                                                        <a key={pIdx} href={mdMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-indigo-400 hover:underline break-all font-bold">
                                                            {mdMatch[1]}
                                                        </a>
                                                    );
                                                }
                                                if (part.match(/^https?:\/\//)) {
                                                    return (
                                                        <a key={pIdx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-indigo-400 hover:underline break-all font-medium">
                                                            {part}
                                                        </a>
                                                    );
                                                } else if (part.startsWith('#')) {
                                                    const keyword = part.replace(/[#.,!]/g, '');
                                                    return (
                                                        <motion.span
                                                            key={pIdx}
                                                            whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#eff6ff' }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={(e) => { e.stopPropagation(); onKeywordClick && onKeywordClick(keyword); }}
                                                            className="inline-flex items-center gap-1 px-3 py-1 m-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 text-sm font-medium cursor-pointer transition-colors border border-slate-200 dark:border-slate-600"
                                                        >
                                                            <Hash size={12} />
                                                            {keyword}
                                                        </motion.span>
                                                    );
                                                }
                                                return part;
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function TrendReport({ report, onKeywordClick, industry, isDark }) {
    const [relativeTime, setRelativeTime] = useState('방금 전');
    const [genTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = Math.floor((new Date() - genTime) / 1000);
            if (diff < 60) setRelativeTime('방금 전');
            else if (diff < 3600) setRelativeTime(`${Math.floor(diff / 60)}분 전`);
            else setRelativeTime(`${Math.floor(diff / 3600)}시간 전`);
        }, 60000);
        return () => clearInterval(timer);
    }, [genTime]);

    const parseItems = (text) => {
        if (!text) return [];
        const parts = text.split(/\n(?=\d+\.\s)/g);
        return parts.filter(part => part.trim().match(/^\d+\.\s/));
    };

    const items = parseItems(report);
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row items-center justify-between px-2 mb-8 gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 font-bold text-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <Calendar size={20} className="text-blue-500 dark:text-indigo-400" />
                        {today}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm font-medium">
                        <Clock size={16} />
                        {relativeTime} 분석
                    </div>
                </div>

                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-2xl text-sm border border-green-100 dark:border-green-800 shadow-sm">
                    <CheckCircle2 size={18} />
                    실시간 분석 완료
                </div>
            </motion.div>

            <div className="space-y-8 pb-10">
                {items.length > 0 ? (
                    items.map((content, idx) => (
                        <TrendCard key={idx} content={content} index={idx} onKeywordClick={onKeywordClick} isDark={isDark} />
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-10 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700"
                    >
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-lg leading-relaxed">{report}</div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

TrendCard.propTypes = {
    content: PropTypes.string,
    index: PropTypes.number,
    onKeywordClick: PropTypes.func,
    isDark: PropTypes.bool,
};

TrendReport.propTypes = {
    report: PropTypes.string,
    onKeywordClick: PropTypes.func,
    industry: PropTypes.string,
    isDark: PropTypes.bool,
};
