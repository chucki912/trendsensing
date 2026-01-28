import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ApiKeyModal from './components/ApiKeyModal';
import IndustryInput from './components/IndustryInput';
import TrendReport from './components/TrendReport';
import StatusDisplay from './components/StatusDisplay';
import Toast from './components/Toast';
import { generateTrendReport } from './services/gemini';
import { Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [apiKey, setApiKey] = useState('');
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [report, setReport] = useState(null);
    const [currentIndustry, setCurrentIndustry] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [history, setHistory] = useState([]);

    // Theme State
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Initial Load
    useEffect(() => {
        const envKey = import.meta.env.VITE_GEMINI_API_KEY;
        const savedKey = localStorage.getItem('gemini_api_key');
        const effectiveKey = envKey || savedKey;

        if (effectiveKey) {
            setApiKey(effectiveKey);
        } else {
            setIsKeyModalOpen(true);
        }

        const savedHistory = JSON.parse(localStorage.getItem('search_history') || '[]');
        setHistory(savedHistory);

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query && effectiveKey) handleSearch(query, effectiveKey);
        else if (query && !effectiveKey) setCurrentIndustry(query);
    }, []);

    const toggleTheme = () => setIsDark(!isDark);
    const showToast = (msg) => setToastMessage(msg);

    const handleCopy = async () => {
        if (!report) return;
        try {
            await navigator.clipboard.writeText(report);
            showToast('리포트가 복사되었습니다.');
        } catch (err) { console.error(err); }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('공유 링크가 복사되었습니다.');
        } catch (err) { console.error(err); }
    };

    const handleDownloadPDF = () => window.print();

    const updateHistory = (term) => {
        let newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
    };

    const handleSearch = async (industry, overrideKey = null) => {
        const keyToUse = overrideKey || apiKey;
        if (!keyToUse) { setIsKeyModalOpen(true); return; }

        setLoading(true);
        setError(null);
        setReport(null);
        setCurrentIndustry(industry);

        const newUrl = `${window.location.pathname}?q=${encodeURIComponent(industry)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        try {
            const result = await generateTrendReport(keyToUse, industry);
            setReport(result);
            updateHistory(industry);
        } catch (err) {
            setError(err.message || "오류가 발생했습니다. API 키를 확인하거나 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeySave = (key) => {
        setApiKey(key);
        if (currentIndustry && !report) handleSearch(currentIndustry, key);
    };

    return (
        <Layout
            isDark={isDark}
            toggleTheme={toggleTheme}
            reportExists={!!report}
            onCopy={handleCopy}
            onShare={handleShare}
            onPDF={handleDownloadPDF}
        >
            <Toast message={toastMessage} onClose={() => setToastMessage('')} />

            <ApiKeyModal
                isOpen={isKeyModalOpen}
                onSave={handleKeySave}
                onClose={() => apiKey ? setIsKeyModalOpen(false) : null}
            />

            <div className="flex flex-col items-center w-full max-w-5xl mx-auto pb-20 px-4">
                <div className="w-full print:hidden">
                    <IndustryInput
                        onSearch={handleSearch}
                        disabled={loading}
                        history={history}
                    />
                </div>

                <div className="w-full min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <StatusDisplay loading={loading} error={null} />
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full flex justify-center"
                            >
                                <StatusDisplay loading={false} error={error} onRetry={() => handleSearch(currentIndustry)} />
                            </motion.div>
                        ) : report ? (
                            <motion.div
                                key="report"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <TrendReport
                                    report={report}
                                    industry={currentIndustry}
                                    onKeywordClick={handleSearch}
                                    isDark={isDark}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                className="flex flex-col items-center py-32 select-none pointer-events-none"
                            >
                                <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-6"></div>
                                <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsKeyModalOpen(true)}
                className="fixed bottom-8 right-8 p-4 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#6366f1] transition-all print:hidden z-40 group"
                title="API Key 설정"
            >
                <Key size={26} className="group-hover:animate-pulse" />
            </motion.button>
        </Layout>
    );
}

export default App;
