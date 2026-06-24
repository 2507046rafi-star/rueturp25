import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Megaphone, 
  Calendar, 
  User, 
  ExternalLink, 
  FileText, 
  Bookmark,
  Bell,
  Search,
  ArrowUpDown,
  Tag,
  Image as ImageIcon,
  Download,
  X
} from "lucide-react";
import { Notice } from "../types";

// Helper scanner to get tags dynamically based on notice text and explicit tags in attachments
export function getNoticeTags(notice: Notice): string[] {
  const tagsAttachment = notice.attachments?.find(att => att.type === "tags");
  if (tagsAttachment) {
    return tagsAttachment.name.split(",").map(t => t.trim()).filter(Boolean);
  }
  
  const tags: string[] = [];
  const text = (notice.title + " " + notice.content).toLowerCase();
  
  if (text.includes("exam") || text.includes("test") || text.includes("mid")) tags.push("Exam");
  if (text.includes("lab") || text.includes("studio") || text.includes("computer")) tags.push("Lab");
  if (text.includes("urgent") || text.includes("important") || text.includes("attention")) tags.push("Urgent");
  if (text.includes("syllabus") || text.includes("curriculum")) tags.push("Syllabus");
  if (text.includes("excursion") || text.includes("tour") || text.includes("field")) tags.push("Excursion");
  if (text.includes("class") || text.includes("time") || text.includes("schedule")) tags.push("Class");
  
  return tags.length > 0 ? tags : ["General"];
}

interface NoticeViewProps {
  notices: Notice[];
  onViewImage?: (src: string, alt: string) => void;
}

export default function NoticeView({ notices, onViewImage }: NoticeViewProps) {
  const [noticeSearch, setNoticeSearch] = useState(() => {
    try {
      return localStorage.getItem("notice_search_init") || "";
    } catch {
      return "";
    }
  });

  React.useEffect(() => {
    try {
      localStorage.removeItem("notice_search_init");
    } catch {}
  }, []);

  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "title" | "author">("date-desc");

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

  // Extract all unique tags across all notices
  const allTagsSet = new Set<string>();
  notices.forEach(notice => {
    getNoticeTags(notice).forEach(tag => allTagsSet.add(tag));
  });
  const availableTags = ["All", ...Array.from(allTagsSet)];

  // Filter & Sort
  const filteredNotices = notices.filter(notice => {
    // 1. Search filter
    const query = noticeSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      notice.title.toLowerCase().includes(query) ||
      notice.content.toLowerCase().includes(query) ||
      notice.author.toLowerCase().includes(query);

    // 2. Tag filter
    const tags = getNoticeTags(notice);
    const matchesTag = selectedTag === "All" || tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "date-asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "author") {
      return a.author.localeCompare(b.author);
    }
    return 0;
  });

  // Check if attachment is image
  const isImageAttachment = (att: { name: string; url: string; type: string }) => {
    if (att.type.startsWith("image/") || att.url.startsWith("data:image/")) return true;
    const imgExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imgExtensions.some(ext => att.name.toLowerCase().endsWith(ext));
  };

  return (
    <div id="notice-view" className="space-y-8 w-full max-w-none px-4">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 text-rose-500">
          <Bell className="w-6 h-6 animate-swing" />
        </div>
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-stone-900 dark:text-white uppercase">
          Notices & Bulletins
        </h2>
        {/* Description in Arial */}
        <p className="text-stone-500 max-w-xl mx-auto text-sm font-arial">
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

      {/* Filter and Sort Toolbar */}
      <div className="bg-white dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-stone-500">
              <Search className="w-4 h-4 text-rose-500" />
            </span>
            <input
              type="text"
              placeholder="Search notices by title, contents, writer..."
              value={noticeSearch}
              onChange={(e) => setNoticeSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition-all"
            />
            {noticeSearch && (
              <button
                onClick={() => setNoticeSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-400 font-mono flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-bahnschrift font-semibold rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400 cursor-pointer"
            >
              <option value="date-desc">🗓️ Date (Newest first)</option>
              <option value="date-asc">🗓️ Date (Oldest first)</option>
              <option value="title">📝 Title (A-Z)</option>
              <option value="author">👤 Author Name</option>
            </select>
          </div>
        </div>

        {/* Tags bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-stone-100 dark:border-stone-900/40 text-xs">
          <span className="text-stone-400 dark:text-stone-500 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Tag className="w-3.5 h-3.5" /> Filter tags:
          </span>
          {availableTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer font-medium tracking-wide uppercase ${
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/30 font-bold"
                  : "bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-rose-500/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        {sortedNotices.length > 0 ? (
          sortedNotices.map((notice, idx) => {
            const tags = getNoticeTags(notice);
            // Separate image attachments from file attachments
            const noticeAttachments = notice.attachments || [];
            const imageAttachments = noticeAttachments.filter(att => att.type !== "tags" && isImageAttachment(att));
            const fileAttachments = noticeAttachments.filter(att => att.type !== "tags" && !isImageAttachment(att));

            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 relative overflow-hidden card-hover text-left shadow-sm"
              >
                {idx === 0 && !noticeSearch && selectedTag === "All" && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-orange-500 text-white px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded-bl-xl flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-white" /> LATEST
                  </div>
                )}

                <div className="space-y-4">
                  {/* Meta details & tags list */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
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

                    {/* Render tag pill inside notice cards */}
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tg, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900 dark:text-white uppercase tracking-tight">
                    {notice.title}
                  </h3>

                  {/* Content (Styled in Arial) */}
                  <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-normal font-arial whitespace-pre-line">
                    {notice.content}
                  </p>

                  {/* Display inline image attachments */}
                  {imageAttachments.length > 0 && (
                    <div className="pt-3">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-rose-500 uppercase block mb-2 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Shared Images ({imageAttachments.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {imageAttachments.map((img, i) => (
                          <div 
                            key={i} 
                            className="relative group rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-100 dark:bg-stone-900 aspect-[4/3] shadow-sm cursor-zoom-in"
                            onClick={() => onViewImage?.(img.url, `${notice.title} - ${img.name}`)}
                          >
                            <img 
                              src={img.url} 
                              alt={img.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350 select-none"
                              title="Click to expand"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="text-[10px] font-mono text-white truncate w-full">{img.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Display file attachments ("flies") */}
                  {fileAttachments.length > 0 && (
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-850/85 mt-4 space-y-3">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-orange-500 uppercase block flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Shared Files & Materials ({fileAttachments.length})
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {fileAttachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.url}
                            download={att.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-900/45 dark:hover:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 transition shadow-sm cursor-pointer hover:shadow group"
                          >
                            <Download className="w-3.5 h-3.5 text-rose-500 group-hover:translate-y-0.5 transition-transform shrink-0" />
                            <span className="line-clamp-1 max-w-[200px]">{att.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-850 shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-500 text-sm">No notices match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
