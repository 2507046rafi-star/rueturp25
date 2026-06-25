import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Map, 
  Layers, 
  Compass, 
  Camera, 
  Lightbulb, 
  Users, 
  Megaphone,
  Globe,
  Settings,
  X,
  Plus,
  Trash2,
  Cpu,
  Bookmark,
  Sparkles
} from "lucide-react";
import { Notice, Student, InsiderTopic, safeStorage } from "../types";
import * as Icons from "lucide-react";

interface HomeViewProps {
  notices: Notice[];
  students: Student[];
  insiders: InsiderTopic[];
  onNavigate: (view: "Home" | "Our Family" | "Notice" | "Cloud" | "Academic Tools" | "Admin Panel") => void;
}

export default function HomeView({ notices, students, insiders = [], onNavigate }: HomeViewProps) {
  const [selectedInsider, setSelectedInsider] = useState<string | null>(null);
  
  // Background images slideshow for Hero section
  const [bgIndex, setBgIndex] = useState(0);
  const backgroundImages = [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80", // (1) Rajshahi University of Engineering and Technology look (red brick campus)
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80", // (2) Night images of earth from satellite
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80", // (3) GIS mapping of Bangladesh of natural beauty
    "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1600&q=80", // (4) Urban & Regional Planning related images
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"  // (5) GIS related images of Bangladesh
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  
  // Brainstorm state
  const [brainstormIdeas, setBrainstormIdeas] = useState<string[]>(() => {
    return safeStorage.parseItem<string[]>("urp_brainstorm_ideas", [
      "Incorporate decentralized rain-gardens across RUET campus to minimize waterlogging.",
      "Design an IoT-based smart traffic signal light system for Rajshahi town intersection.",
      "Utilize spatial buffering to optimize waste disposal sites around the Padma River bank."
    ]);
  });
  const [newIdea, setNewIdea] = useState("");

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    const updated = [newIdea, ...brainstormIdeas];
    setBrainstormIdeas(updated);
    safeStorage.setItem("urp_brainstorm_ideas", JSON.stringify(updated));
    setNewIdea("");
  };

  const handleDeleteIdea = (index: number) => {
    const updated = brainstormIdeas.filter((_, i) => i !== index);
    setBrainstormIdeas(updated);
    safeStorage.setItem("urp_brainstorm_ideas", JSON.stringify(updated));
  };

  const latestNotice = notices[0] || {
    title: "No active notices",
    content: "Check back later for official announcements."
  };

  // Dynamically resolve icons and construct insiders array
  const dynamicInsiders = insiders.map(ins => {
    const IconComponent = (Icons as any)[ins.icon] || Icons.Map;
    return {
      id: ins.id,
      title: ins.title,
      short: ins.short,
      icon: IconComponent,
      bg: ins.bg || "from-rose-500/10 to-orange-500/10 border-rose-500/20",
      attachments: ins.attachments || [],
      content: (
        <div className="space-y-4">
          <div className="text-gray-650 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {ins.content}
          </div>
        </div>
      )
    };
  });

  // Always append the brainstorm board at the end of the insiders list
  const allInsiders = [
    ...dynamicInsiders,
    {
      id: "brainstorm",
      title: "Brainstorm Workspace",
      short: "Dynamic Smart-City Suggestion Board",
      icon: Icons.Lightbulb,
      bg: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30",
      attachments: [],
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            An open spatial suggestion notepad for the batch. Share innovative urban plans, transit theories, or ideas to upgrade our campus environment.
          </p>
          <form onSubmit={handleAddIdea} className="flex gap-2">
            <input 
              type="text" 
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Suggest a smart-city plan..."
              className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 text-gray-800 dark:text-gray-100"
            />
            <button 
              type="submit" 
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition flex items-center gap-1 cursor-pointer"
            >
              <Icons.Plus className="w-3 h-3" /> Add
            </button>
          </form>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {brainstormIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs flex justify-between gap-3 group relative hover:border-rose-400/50"
              >
                <div className="flex gap-2">
                  <Icons.Bookmark className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200 leading-relaxed">{idea}</span>
                </div>
                <button 
                  onClick={() => handleDeleteIdea(idx)}
                  className="text-gray-400 hover:text-red-500 shrink-0 self-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Remove idea"
                >
                  <Icons.Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="home-view" className="space-y-16">
      {/* Sleek Layout combining side-bar and Hero - borderless and barrieless */}
      <section className="relative flex overflow-hidden min-h-[65vh] w-full text-stone-900 dark:text-white">
        {/* Animated Background Maps & RUET Slideshow with 75% transparency (0.25 opacity) and side-to-side panning */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {backgroundImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${bgIndex === idx ? "opacity-25" : "opacity-0"}`}
              style={{
                opacity: bgIndex === idx ? 0.25 : 0,
              }}
            >
              <div 
                className="w-full h-full pan-image"
                style={{
                  backgroundImage: `url('${imgUrl}')`,
                }}
              />
            </div>
          ))}
          {/* Subtle gradient dark/light overlay to keep text comfortable to see */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50/90 via-stone-50/60 to-transparent dark:from-stone-950/90 dark:via-stone-950/60 dark:to-transparent" />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 text-left relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/5 to-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <h1 className="spacex-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-stone-900 dark:text-white uppercase leading-[0.9] font-black font-display font-display">
              WELCOME IN<br />
              <span className="text-gradient-rose-orange">RUET URP'25</span>
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-[17px] sm:text-[19px] font-normal leading-relaxed max-w-xl">
              Explore the Official Portal of RUET URP'25 — a dynamic digital platform connecting the students of the Department of Urban & Regional Planning, Rajshahi University of Engineering & Technology (RUET).
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate("Our Family")}
                className="btn-spacex px-8 py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:opacity-95 transition duration-300 rounded"
              >
                Meet the Family
              </button>
              <button 
                onClick={() => onNavigate("Notice")}
                className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest border border-stone-250 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition duration-300 rounded cursor-pointer"
              >
                Academic Notices
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features Grid (Matching Theme's bento feel) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-stone-200 dark:border-stone-850 rounded-2xl bg-white dark:bg-stone-950 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-850">
        
        {/* Box 1: Quick Notice */}
        <div 
          onClick={() => onNavigate("Notice")}
          className="p-8 card-hover bg-white dark:bg-stone-950 hover:bg-stone-50/50 dark:hover:bg-stone-900/20 text-left flex flex-col justify-between min-h-[220px] cursor-pointer"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-[10px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              LATEST NOTICE
            </span>
            <span className="text-stone-300 dark:text-stone-750 font-display font-bold text-3xl">01</span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300 mb-1.5 truncate">
              {latestNotice.title}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal line-clamp-3">
              {latestNotice.content}
            </p>
          </div>
          <div className="mt-4 text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
            Read Notice Board <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Box 2: Family / Members */}
        <div 
          onClick={() => onNavigate("Our Family")}
          className="p-8 card-hover bg-white dark:bg-stone-950 hover:bg-stone-50/50 dark:hover:bg-stone-900/20 text-left flex flex-col justify-between min-h-[220px] cursor-pointer"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-[10px] bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              BATCH MEMBERS
            </span>
            <span className="text-stone-300 dark:text-stone-750 font-display font-bold text-3xl">02</span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300 mb-2">
              URP'25 Insiders
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[9px] font-mono border border-stone-200 dark:border-stone-800 px-2 py-0.5 rounded text-stone-500 dark:text-stone-400">GIS Club</span>
              <span className="text-[9px] font-mono border border-stone-200 dark:border-stone-800 px-2 py-0.5 rounded text-stone-500 dark:text-stone-400">URP Core</span>
              <span className="text-[9px] font-mono border border-stone-200 dark:border-stone-800 px-2 py-0.5 rounded text-stone-500 dark:text-stone-400">Photography</span>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
            Browse Family <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Box 3: Cloud / Materials */}
        <div 
          onClick={() => onNavigate("Cloud")}
          className="p-8 card-hover bg-white dark:bg-stone-950 hover:bg-stone-50/50 dark:hover:bg-stone-900/20 text-left flex flex-col justify-between min-h-[220px] cursor-pointer"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-[10px] bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              DRIVE STORAGE
            </span>
            <span className="text-stone-300 dark:text-stone-750 font-display font-bold text-3xl">03</span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300 mb-1.5">
              Academic Cloud
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              Access 1st to 4th year lecture files, drive folders, book archives, and utility programs.
            </p>
          </div>
          <div className="mt-4 text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
            Explore Drive <ArrowRight className="w-3 h-3" />
          </div>
        </div>

      </section>

      {/* URP'25 Insiders bento layout */}
      <section className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl tracking-tight text-stone-900 dark:text-white uppercase">
            URP'25 Insiders
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto text-sm">
            Discover the internal subgroups and focused clubs keeping our batch at the cutting edge of planning and aesthetics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {allInsiders.map((insider) => {
            const IconComponent = insider.icon;
            return (
              <motion.div
                key={insider.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedInsider(insider.id)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${insider.bg} border text-left cursor-pointer transition-shadow hover:shadow-md flex flex-col justify-between h-48 group`}
              >
                <div>
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 w-11 h-11 flex items-center justify-center border border-stone-200/50 dark:border-stone-800/50 shadow-sm">
                    <IconComponent className="w-5 h-5 text-rose-500 dark:text-rose-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-stone-800 dark:text-white mt-4 uppercase">
                    {insider.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                    {insider.short}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-rose-500 group-hover:underline flex items-center gap-1 self-start mt-4">
                  Open Workspace <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SpaceX Styled Insider Modal */}
      <AnimatePresence>
        {selectedInsider && (() => {
          const item = allInsiders.find(i => i.id === selectedInsider);
          if (!item) return null;
          const Icon = item.icon;
          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
              >
                {/* Header banner */}
                <div className="bg-gradient-to-r from-rose-500/20 to-orange-500/20 p-6 border-b border-stone-200 dark:border-stone-850 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <Icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-semibold tracking-widest text-rose-500 uppercase">Insider Group</span>
                    <h3 className="font-display font-bold text-xl text-stone-900 dark:text-white uppercase">{item.title}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedInsider(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                  {item.content}

                  {/* Dynamic Attachments List */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-850 space-y-3 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase text-stone-400 block tracking-wider">
                        Topic Resources & Files ({item.attachments.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.attachments.map((att: any, attIdx: number) => {
                          const isImage = att.type?.startsWith("image/");
                          return (
                            <div 
                              key={attIdx} 
                              className="p-3 rounded-xl bg-stone-50 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 flex flex-col justify-between gap-2.5 text-xs"
                            >
                              {isImage ? (
                                <img 
                                  src={att.url} 
                                  alt={att.name} 
                                  className="w-full h-24 object-cover rounded-lg mb-1" 
                                  referrerPolicy="no-referrer" 
                                />
                              ) : null}
                              <div>
                                <span className="font-mono font-bold text-stone-700 dark:text-stone-300 truncate block text-[11px]" title={att.name}>
                                  {att.name}
                                </span>
                              </div>
                              <a 
                                href={att.url} 
                                download={att.name} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10px] font-bold text-rose-500 hover:underline uppercase self-start mt-1 flex items-center gap-1 cursor-pointer"
                              >
                                Download / View
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-850 flex justify-end">
                  <button 
                    onClick={() => setSelectedInsider(null)}
                    className="px-4 py-2 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Close Workspace
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
