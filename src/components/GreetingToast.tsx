import React from "react";
import { motion } from "motion/react";
import { X, Sparkles } from "lucide-react";

interface GreetingToastProps {
  message: string;
  onClose: () => void;
}

export default function GreetingToast({ message, onClose }: GreetingToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        x: 0,
        transition: { type: "spring", stiffness: 120, damping: 15 }
      }}
      exit={{ 
        opacity: 0, 
        y: 20, 
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeInOut" }
      }}
      className="fixed bottom-6 right-6 md:bottom-24 max-w-sm w-[calc(100vw-3rem)] z-50 subtle-animated-border shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="subtle-animated-inner p-4 pr-10 flex gap-3 relative text-left">
        {/* Sparkles icon container with gradient background */}
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500/10 to-orange-500/10 dark:from-rose-500/20 dark:to-orange-500/20 border border-rose-500/20 shrink-0 h-10 w-10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-rose-500 dark:text-rose-400 animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            Class Workspace Update
          </div>
          <p className="text-xs font-normal text-stone-700 dark:text-stone-300 leading-relaxed font-arial select-none">
            {message}
          </p>
        </div>

        {/* Close button with subtle micro-interactions */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-800 cursor-pointer"
          title="Close Greeting"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
