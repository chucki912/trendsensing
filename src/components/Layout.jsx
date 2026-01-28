import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon, Zap, Share2, FileDown, Copy, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, isDark, toggleTheme, reportExists, onCopy, onShare, onPDF }) {
    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogoClick = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.2 },
            colors: ['#6366f1', '#8b5cf6', '#06b6d4']
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen relative font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
            {/* Sticky Header */}
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 print:hidden py-4
                ${scrolled ? 'backdrop-blur-xl bg-white/80 dark:bg-slate-900/90 shadow-lg dark:shadow-slate-900/50 border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogoClick}
                        className="flex items-center gap-3 shrink-0 cursor-pointer group"
                    >
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 dark:from-indigo-600 dark:to-violet-700 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                            <Zap size={22} fill="currentColor" className="logo-invert" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100 hidden sm:block">
                            Trend Sensing AI
                        </span>
                    </motion.div>

                    {/* Action Buttons in Header */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                        <AnimatePresence>
                            {reportExists && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2"
                                >
                                    <button onClick={onShare} className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
                                        <Share2 size={16} /> <span className="hidden md:inline">공유</span>
                                    </button>
                                    <button onClick={onPDF} className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
                                        <FileDown size={16} /> <span className="hidden md:inline">PDF</span>
                                    </button>
                                    <button onClick={onCopy} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
                                        <Copy size={16} /> <span className="hidden md:inline">복사</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                        <motion.button
                            whileTap={{ scale: 0.9, rotate: 15 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-amber-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 relative overflow-hidden"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isDark ? 'dark' : 'light'}
                                    initial={{ y: -20, opacity: 0, rotate: -45 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 20, opacity: 0, rotate: 45 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="container max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-16 relative z-10 flex flex-col min-h-[calc(100vh-4rem)]">
                {/* Hero Section */}
                <section className="text-center mb-16 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-tight text-slate-900 dark:text-white"
                    >
                        주간 트렌드 리포트
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        최신 뉴스를 실시간으로 분석하여 <br className="hidden sm:block" />
                        가장 중요한 비즈니스 인사이트를 제공합니다.
                    </motion.p>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-indigo-900/20 dark:to-transparent -z-10 rounded-full blur-3xl"></div>
                </section>

                <div className="flex-grow w-full relative z-20">
                    {children}
                </div>
            </main>

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-24 p-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-2xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 z-40 print:hidden"
                        title="맨 위로"
                    >
                        <ChevronUp size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node,
    isDark: PropTypes.bool,
    toggleTheme: PropTypes.func,
    reportExists: PropTypes.bool,
    onCopy: PropTypes.func,
    onShare: PropTypes.func,
    onPDF: PropTypes.func,
};
