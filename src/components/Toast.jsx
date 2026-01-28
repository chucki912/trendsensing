import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    className="fixed top-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-black/50 border border-slate-100 dark:border-slate-700 pointer-events-auto"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <CheckCircle size={20} />
                    </div>

                    <span className="text-slate-800 dark:text-slate-200 font-bold pr-2">{message}</span>

                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

Toast.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
