import React from "react";
import { motion } from "motion/react";
import { 
  FileText, 
  Cpu, 
  Network, 
  BookOpen, 
  ExternalLink, 
  Settings, 
  Compass
} from "lucide-react";

export default function AcademicToolsView() {
  const tools = [
    {
      id: "cover",
      title: "Cover Page Generator",
      description: "Instantly create standardized RUET lab report cover sheets, project reports, and studio drafts using correct academic margins and fonts.",
      url: "https://ruet-cover-page.github.io/",
      icon: FileText,
      badge: "External Tool",
      color: "from-rose-500/10 to-orange-500/10 border-rose-500/20 text-rose-500"
    },
    {
      id: "software",
      title: "Software Drive",
      description: "Direct download links to essential softwares including AutoCAD, ArcGIS, QGIS, SketchUp, and useful projection plugins.",
      url: "https://drive.google.com/drive/folders/1wfKVYklIfHc17u8uv6NHgrmCgVdQGMgg?usp=drive_link",
      icon: Cpu,
      badge: "Google Drive Folder",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-500"
    },
    {
      id: "alumni",
      title: "Alumni Networks",
      description: "Establish connections with professional RUET planning graduates worldwide, BIP chapters, and municipal consultants.",
      url: "https://alumni.ruet.ac.bd/",
      icon: Network,
      badge: "Alumni Directory",
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-500"
    },
    {
      id: "resources",
      title: "Academic Papers & Templates",
      description: "Curated research papers from BIP (Bangladesh Institute of Planners) journals, regional master plan templates, and GIS spreadsheets.",
      url: "https://www.urp.ruet.ac.bd/notice",
      icon: BookOpen,
      badge: "Syllabus Guide",
      color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-500"
    }
  ];

  return (
    <div id="academic-tools-view" className="space-y-10 w-full max-w-5xl mx-auto px-1 sm:px-4">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 text-rose-500">
          <Settings className="w-6 h-6 animate-spin-slow" />
        </div>
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white uppercase">
          Academic Tools & Resources
        </h2>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          const isCoverGenerator = tool.id === "cover";

          const cardContent = (
            <div className="flex flex-col justify-between h-full w-full">
              <div>
                {/* Header Icon + Badge */}
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} border shadow-sm`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
                    {tool.badge}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white uppercase tracking-tight mt-4">
                  {tool.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed font-normal line-clamp-2">
                  {tool.description}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2 bg-stone-50 hover:bg-stone-900 hover:text-white dark:bg-stone-900 dark:hover:bg-white text-stone-700 dark:text-stone-200 rounded text-xs font-bold uppercase tracking-wider transition inline-flex items-center justify-center gap-1 border border-stone-200 dark:border-stone-800 cursor-pointer"
              >
                Access Channel <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );

          if (isCoverGenerator) {
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4 }}
                className="subtle-animated-border text-left relative group h-56 cursor-pointer"
              >
                <div className="subtle-animated-inner p-6 h-full flex flex-col justify-between bg-white dark:bg-stone-950">
                  {cardContent}
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={tool.id}
              whileHover={{ y: -4, boxShadow: "0 8px 16px -8px rgba(0,0,0,0.1)" }}
              className="p-6 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-left flex flex-col justify-between h-56 relative group card-hover"
            >
              {cardContent}
            </motion.div>
          );
        })}
      </div>

      {/* Mini Tips Info block */}
      <div className="p-5 bg-gradient-architectural border border-rose-100 dark:border-gray-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="p-2.5 rounded-full bg-orange-500 text-white">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">
            Important Software Guidelines
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal max-w-2xl font-light">
            Please ensure you have at least 8GB of RAM on your laptop when running ArcGIS / QGIS mapping tools with large regional rasters. Contact Sadat Rahman if you experience setup blockages.
          </p>
        </div>
      </div>
    </div>
  );
}

