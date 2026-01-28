import { useState, useEffect } from 'react';
import { Key, ShieldCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiKeyModal({ isOpen, onSave, onClose }) {
    const [key, setKey] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setKey(savedKey);
    }, []);

    const handleSave = () => {
        if (!key.trim()) return;
        localStorage.setItem('gemini_api_key', key);
        onSave(key);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
                        onClick={() => key && onClose()}
                    ></motion.div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-up"
                    >
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="p-4 bg-blue-50 dark:bg-indigo-900/30 rounded-2xl text-blue-500 dark:text-indigo-400 mb-6 shadow-inner">
                                <Key size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Google Gemini API Key</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">트렌드 분석을 위해 API 키 설정이 필요합니다.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">
                                    Your API Key
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-indigo-500/10 outline-none transition-all font-mono"
                                        placeholder="AIzaSy..."
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl text-blue-600 dark:text-blue-400 text-xs border border-blue-100/50 dark:border-blue-800/20">
                                <ShieldCheck size={16} />
                                <span>키는 브라우저 보안 저장소에만 저장됩니다.</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={!key.trim()}
                                    className="btn-primary w-full justify-center py-4 text-base shadow-xl"
                                >
                                    저장 및 분석 시작하기
                                </button>
                                {key && (
                                    <button
                                        onClick={onClose}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium transition-colors"
                                    >
                                        나중에 하기
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

ApiKeyModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};
