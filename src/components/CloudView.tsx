import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Folder, 
  ExternalLink, 
  Cloud, 
  HardDrive, 
  ChevronRight, 
  Layers, 
  FolderHeart,
  Server
} from "lucide-react";

interface CloudViewProps {
  cloudDriveUrl?: string;
  academicDriveUrl?: string;
}

export default function CloudView({ cloudDriveUrl, academicDriveUrl }: CloudViewProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(1);

  const yearsData = [
    {
      year: 1,
      title: "1st Year",
      description: "",
      drives: [
        {
          name: "Drive - 01",
          url: cloudDriveUrl || "https://drive.google.com/drive/folders/1Lto8hLFOJ13Evd8wNbr_Gt7s_nZRLBtB",
          desc: ""
        },
        {
          name: "Drive - 02",
          url: academicDriveUrl || "https://drive.google.com/drive/folders/1EprFnQrzZ3HafRD2lbOFNHosqAxbmQ_i",
          desc: ""
        }
      ]
    },
    {
      year: 2,
      title: "2nd Year",
      description: "",
      drives: [
        {
          name: "Drive - 01",
          url: academicDriveUrl || "https://drive.google.com/drive/folders/1wfKVYklIfHc17u8uv6NHgrmCgVdQGMgg?usp=drive_link",
          desc: ""
        },
        {
          name: "Drive - 02",
          url: cloudDriveUrl || "https://drive.google.com/drive/folders/1EprFnQrzZ3HafRD2lbOFNHosqAxbmQ_i",
          desc: ""
        }
      ]
    },
    {
      year: 3,
      title: "3rd Year",
      description: "",
      drives: [
        {
          name: "Drive - 01",
          url: cloudDriveUrl || "https://drive.google.com/drive/folders/1Lto8hLFOJ13Evd8wNbr_Gt7s_nZRLBtB",
          desc: ""
        },
        {
          name: "Drive - 02",
          url: academicDriveUrl || "https://drive.google.com/drive/folders/1EprFnQrzZ3HafRD2lbOFNHosqAxbmQ_i",
          desc: ""
        }
      ]
    },
    {
      year: 4,
      title: "4th Year",
      description: "",
      drives: [
        {
          name: "Drive - 01",
          url: cloudDriveUrl || "https://drive.google.com/drive/folders/1Lto8hLFOJ13Evd8wNbr_Gt7s_nZRLBtB",
          desc: ""
        },
        {
          name: "Drive - 02",
          url: academicDriveUrl || "https://drive.google.com/drive/folders/1wfKVYklIfHc17u8uv6NHgrmCgVdQGMgg?usp=drive_link",
          desc: ""
        }
      ]
    }
  ];

  return (
    <div id="cloud-view" className="space-y-8 w-full max-w-5xl mx-auto px-1 sm:px-4">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 text-rose-500">
          <Cloud className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white uppercase">
          URP'25 Digital Cloud
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          A centralized, secure archive containing batch drive links for syllabus files, studio blueprints, and textbook materials.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Folder list (Year Select) */}
        <div className="md:col-span-5 space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block mb-1">
            Academic Levels
          </span>
          {yearsData.map((data) => (
            <button
              key={data.year}
              onClick={() => setSelectedYear(data.year)}
              className={`w-full p-4 rounded-xl text-left border transition duration-300 flex items-center justify-between group cursor-pointer ${
                selectedYear === data.year
                  ? "bg-gradient-to-r from-rose-50/50 to-orange-50/50 dark:from-stone-900 dark:to-stone-800 border-rose-400/50 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-300 hover:border-rose-400/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  selectedYear === data.year ? "text-rose-500 fill-rose-100 dark:fill-rose-950/20" : "text-gray-400"
                }`} />
                <div>
                  <h3 className="text-sm font-semibold uppercase font-display tracking-tight">
                    {data.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
                    {data.description}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                selectedYear === data.year ? "translate-x-1 text-rose-500" : "text-gray-400 group-hover:translate-x-0.5"
              }`} />
            </button>
          ))}
        </div>

        {/* Right Side: Drive details (Sub-files explorer) */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {selectedYear && (() => {
              const activeData = yearsData.find(d => d.year === selectedYear);
              if (!activeData) return null;
              return (
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 space-y-6"
                >
                  <div className="border-b border-stone-200 dark:border-stone-850 pb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-orange-500 dark:text-orange-400 uppercase">
                      Shared Directories
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-stone-900 dark:text-white uppercase tracking-tight mt-1">
                      {activeData.title}
                    </h3>
                    {activeData.description && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-normal leading-relaxed">
                        {activeData.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {activeData.drives.map((drive, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-stone-50/50 dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 hover:border-rose-400/50 transition duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <HardDrive className="w-5 h-5 text-orange-500 shrink-0" />
                            <span className="font-display font-extrabold text-lg sm:text-xl text-stone-900 dark:text-white uppercase tracking-tight">
                              {drive.name}
                            </span>
                          </div>
                          {drive.desc && (
                            <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                              {drive.desc}
                            </p>
                          )}
                        </div>
                        <a
                          href={drive.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded bg-white dark:bg-stone-900 hover:bg-stone-900 dark:hover:bg-white text-stone-750 dark:text-stone-200 hover:text-white dark:hover:text-stone-900 text-xs font-bold uppercase tracking-wider transition inline-flex items-center justify-center gap-1.5 border border-stone-250 dark:border-stone-750 shrink-0 cursor-pointer"
                        >
                          Open Drive <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl text-[11px] text-gray-500 dark:text-gray-400 font-mono border border-rose-100/50 dark:border-rose-900/20 flex items-center gap-2">
                    <Server className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Securely hosted on official Google Cloud drive containers.</span>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
