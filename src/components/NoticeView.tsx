import React from "react";
import { motion } from "motion/react";
import { 
  Megaphone, 
  Calendar, 
  User, 
  ExternalLink, 
  FileText, 
  Bookmark,
  Bell
} from "lucide-react";
import { Notice } from "../types";

interface NoticeViewProps {
  notices: Notice[];
}

export default function NoticeView({ notices }: NoticeViewProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="notice-view" className="space-y-8 w-full max-w-none px-4">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 text-rose-500">
          <Bell className="w-6 h-6 animate-swing" />
        </div>
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white uppercase">
          Notices & Bulletins
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Keep track of class schedules, exams, excursions, laboratory guidelines, and urgent announcements.
        </p>

        {/* University Notice Link Option */}
        <div className="pt-2">
          <a
            href="https://www.urp.ruet.ac.bd/notice"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold tracking-wider uppercase transition inline-flex items-center gap-2 mx-auto cursor-pointer shadow-sm hover:shadow"
          >
            Go to RUET University Notice Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        {notices.length > 0 ? (
          notices.map((notice, idx) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 relative overflow-hidden card-hover"
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-orange-500 text-white px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded-bl-xl flex items-center gap-1">
                  <Bookmark className="w-3 h-3 fill-white" /> LATEST
                </div>
              )}

              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    {formatDate(notice.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    Authored by: {notice.author}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-gray-800 dark:text-white uppercase tracking-tight">
                  {notice.title}
                </h3>

                {/* Content */}
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-normal whitespace-pre-line">
                  {notice.content}
                </p>

                {/* Attachments Section */}
                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-850/80 mt-4 space-y-3">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-orange-500 uppercase block">
                      Attachments & Shared Materials ({notice.attachments.length})
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {notice.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          download={att.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-900/45 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 transition shadow-sm cursor-pointer hover:shadow"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="line-clamp-1 max-w-[200px]">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-500 text-sm">No notices have been uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
