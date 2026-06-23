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
import { Notice, Student, safeStorage } from "../types";

interface HomeViewProps {
  notices: Notice[];
  students: Student[];
  onNavigate: (view: "Home" | "Our Family" | "Notice" | "Cloud" | "Academic Tools" | "Gallery" | "Admin Panel") => void;
}

export default function HomeView({ notices, students, onNavigate }: HomeViewProps) {
  const [selectedInsider, setSelectedInsider] = useState<string | null>(null);
  
  // Background images slideshow for Hero section
  const [bgIndex, setBgIndex] = useState(0);
  const backgroundImages = [
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80", // Map of Bangladesh / Geographic grid
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80", // Whole world map network
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1600&q=80", // Stunning earth view from space
    "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1600&q=80", // Urban planning city map blueprint layout
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1600&q=80", // Topographic map curves and physical land contour lines
    "https://images.unsplash.com/photo-1503387762458-7e52d4efddca?auto=format&fit=crop&w=1600&q=80", // Spatial engineering, architecture blueprint plan
    "https://images.unsplash.com/photo-1590012314607-cda9d9b6a919?auto=format&fit=crop&w=1600&q=80"  // Red brick campus architectural structure (RUET look)
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4500);
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

  const insiders = [
    {
      id: "gis",
      title: "GIS Club",
      short: "Spatial Buffering & Advanced Geoprocessing",
      icon: Map,
      bg: "from-blue-600/20 to-indigo-600/20 border-blue-500/30",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            The GIS Club analyzes geographic patterns to draft strategic regional masterplans. 
            We utilize ArcMap, QGIS, and Google Earth Engine to build layers, analyze spatial buffering, 
            and design smart-city models.
          </p>
          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-xs text-rose-500 space-y-2">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
              <span>Projection System:</span>
              <span>BUTM (Bangladesh Universal Transverse Mercator)</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
              <span>Standard Datum:</span>
              <span>BGD2006 / WGS 84</span>
            </div>
            <div className="flex justify-between">
              <span>Main Operations:</span>
              <span>Vector Clipping, Density Heatmaps, NDVI Analytics</span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-r from-rose-500/10 to-orange-500/10 rounded-lg text-xs border border-rose-500/20">
            <strong>Current Research:</strong> Multi-Criteria Decision Analysis (MCDA) for landfill allocation in the Rajshahi Metropolitan area.
          </div>
        </div>
      )
    },
    {
      id: "core",
      title: "URP Core",
      short: "Urban Planning & Zoning Policies",
      icon: Layers,
      bg: "from-rose-600/20 to-red-600/20 border-rose-500/30",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Focuses on structural zoning regulations, building code compliance, and Master Plan structures. 
            Understanding land use controls and zoning bylaws that regulate Bangladesh's urban growth.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-orange-500 font-semibold block mb-1">FAR Calculation</span>
              Floor Area Ratio constraints for modern high-rise residences.
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-rose-500 font-semibold block mb-1">Setback Rules</span>
              Min distance from street line for visual harmony.
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            *Based on Bangladesh National Building Code (BNBC) & Rajshahi Master Plan Guidelines.
          </div>
        </div>
      )
    },
    {
      id: "arch",
      title: "Architecture Studio",
      short: "Creative Drafting & 3D Modeling",
      icon: Compass,
      bg: "from-amber-600/20 to-orange-600/20 border-orange-500/30",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Where urban scale meets fine aesthetics. We draft isometric blueprints, study spatial forms, 
            and render models using SketchUp, AutoCAD, and Revit.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
            <span className="text-xs text-gray-400 block font-mono">STUDIO PROJECT #01: SUSTAINABLE COMMUNITY RECREATION PARK</span>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-4/5"></div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-gray-500">
              <span>80% Render Complete</span>
              <span>Due: Thursday</span>
            </div>
          </div>
          <p className="text-xs italic text-gray-500">
            "A town is not just a collection of buildings, but a living body shaped by community patterns."
          </p>
        </div>
      )
    },
    {
      id: "photography",
      title: "Photography Society",
      short: "Documenting Spatial Elements & City Life",
      icon: Camera,
      bg: "from-purple-600/20 to-pink-600/20 border-purple-500/30",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Capturing the architectural textures, riverbank horizons, and urban environments. 
            We organize batch photography walks along the Padma river and the red-brick RUET campus.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 rounded bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=150&q=80')` }} />
            <div className="h-16 rounded bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&q=80')` }} />
            <div className="h-16 rounded bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=150&q=80')` }} />
          </div>
          <div className="text-xs font-mono text-gray-400 flex justify-between">
            <span>Lens Focus: 35mm / 50mm Street</span>
            <span>Active Members: 18</span>
          </div>
        </div>
      )
    },
    {
      id: "brainstorm",
      title: "Brainstorm Workspace",
      short: "Dynamic Smart-City Suggestion Board",
      icon: Lightbulb,
      bg: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30",
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
              <Plus className="w-3 h-3" /> Add
            </button>
          </form>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {brainstormIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs flex justify-between gap-3 group relative hover:border-rose-400/50"
              >
                <div className="flex gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-200 leading-relaxed">{idea}</span>
                </div>
                <button 
                  onClick={() => handleDeleteIdea(idx)}
                  className="text-gray-400 hover:text-red-500 shrink-0 self-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Remove idea"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
      {/* Sleek Layout combining side-bar and Hero */}
      <section className="relative flex border border-stone-200 dark:border-stone-850 bg-stone-50/20 dark:bg-stone-950/20 rounded-2xl overflow-hidden min-h-[60vh] backdrop-blur-sm">
        {/* Animated Background Maps & RUET Slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {backgroundImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{
                backgroundImage: `url('${imgUrl}')`,
                opacity: bgIndex === idx ? 0.06 : 0,
                transform: bgIndex === idx ? "scale(1.02)" : "scale(1.05)"
              }}
            />
          ))}
          {/* Subtle gradient dark/light overlay to keep text comfortable to see */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50/95 via-stone-50/80 to-transparent dark:from-stone-950/95 dark:via-stone-950/80 dark:to-transparent" />
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
              Explore the official portal of URP'25 batch. A high-performance hub for academic excellence, coordination, and creative planning.
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
          {insiders.map((insider) => {
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
          const item = insiders.find(i => i.id === selectedInsider);
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
                <div className="p-6">
                  {item.content}
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
