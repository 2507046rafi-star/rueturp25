import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  Mail, 
  Info, 
  Shield, 
  Globe, 
  X, 
  ExternalLink, 
  ChevronUp, 
  Compass, 
  CheckCircle,
  Award
} from "lucide-react";
import { AdminSettings } from "../types";

interface FooterProps {
  contactInfo: { email: string; phone: string };
  adminSettings: AdminSettings;
  onlinePlatforms: { name: string; url: string }[];
  onNavigate: (view: "Home" | "Our Family" | "Notice" | "Cloud" | "Academic Tools" | "Gallery" | "Admin Panel") => void;
}

export default function Footer({ contactInfo, adminSettings, onlinePlatforms, onNavigate }: FooterProps) {
  const [activeModal, setActiveModal] = useState<"about" | "policy" | "platforms" | null>(null);

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <footer className="mt-16 border-t border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-950 transition duration-300 relative z-10">
      <div className="w-full max-w-none px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1 text-left">
            <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase tracking-wider">
              RUET URP'25
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
              Official academic gateway for the Department of Urban and Regional Planning, Batch 2025, Rajshahi University of Engineering and Technology.
            </p>
          </div>

          {/* Quick Nav Col */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Navigation
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button onClick={() => onNavigate("Home")} className="text-gray-500 hover:text-rose-500 transition text-left cursor-pointer uppercase font-semibold">Home</button>
              <button onClick={() => onNavigate("Our Family")} className="text-gray-500 hover:text-rose-500 transition text-left cursor-pointer uppercase font-semibold">Our Family</button>
              <button onClick={() => onNavigate("Notice")} className="text-gray-500 hover:text-rose-500 transition text-left cursor-pointer uppercase font-semibold">Notices</button>
              <button onClick={() => onNavigate("Cloud")} className="text-gray-500 hover:text-rose-500 transition text-left cursor-pointer uppercase font-semibold">Cloud Storage</button>
            </div>
          </div>

          {/* Quick Enquiries Col */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Interactive Resources
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs font-semibold uppercase">
              <button 
                onClick={() => setActiveModal("about")}
                className="text-gray-500 hover:text-rose-500 transition text-left flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-rose-500" /> About RUET URP'25
              </button>
              <button 
                onClick={() => setActiveModal("policy")}
                className="text-gray-500 hover:text-rose-500 transition text-left flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-orange-500" /> Website Policy
              </button>
              <button 
                onClick={() => setActiveModal("platforms")}
                className="text-gray-500 hover:text-rose-500 transition text-left flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-rose-400" /> Online Platforms
              </button>
            </div>
          </div>

          {/* Direct Contact Col */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Contact Channels
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-gray-600 dark:text-gray-300 font-normal">
                For administrative requests or profile registrations, reach out immediately:
              </p>
              <div className="space-y-1.5 font-mono">
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-rose-500 transition"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
                <a 
                  href={`tel:${contactInfo.phone}`} 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-rose-500 transition"
                  title="Direct Call"
                >
                  <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{contactInfo.phone}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright margin */}
        <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-850 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-400 gap-4">
          <div>
            © 2026 RUET URP'25
          </div>
          <div className="flex gap-4">
            <button onClick={() => onNavigate("Admin Panel")} className="hover:text-rose-500 transition cursor-pointer uppercase font-bold tracking-widest">
              🔒 Admin Terminal
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg">
                    {activeModal === "about" && <Info className="w-5 h-5" />}
                    {activeModal === "policy" && <Shield className="w-5 h-5" />}
                    {activeModal === "platforms" && <Globe className="w-5 h-5" />}
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-gray-950 dark:text-white uppercase tracking-tight">
                    {activeModal === "about" && "About RUET URP'25"}
                    {activeModal === "policy" && "Website Policy Guidelines"}
                    {activeModal === "platforms" && "Online Community Platforms"}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-normal">
                
                {/* ABOUT MODAL CONTENT */}
                {activeModal === "about" && (
                  <div className="space-y-4">
                    {adminSettings.aboutUsImage && (
                      <div className="rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 shadow-sm">
                        <img 
                          src={adminSettings.aboutUsImage} 
                          alt="RUET Department of URP" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="whitespace-pre-line text-xs leading-relaxed font-sans text-gray-700 dark:text-gray-300">
                      {adminSettings.aboutUs}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider text-right border-t border-gray-100 dark:border-gray-800 pt-2">
                      Word count: {wordCount(adminSettings.aboutUs)} / 1000 limit
                    </div>
                  </div>
                )}

                {/* POLICY MODAL CONTENT */}
                {activeModal === "policy" && (
                  <div className="space-y-2 text-xs font-sans whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {adminSettings.policy}
                  </div>
                )}

                {/* PLATFORMS MODAL CONTENT */}
                {activeModal === "platforms" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Join the official online forums and instant messenger groups to connect directly with class representatives and find study materials.
                    </p>
                    <div className="space-y-3">
                      {onlinePlatforms.map((plat, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-750 flex items-center justify-between gap-4 hover:border-rose-400/50 transition duration-300 group"
                        >
                          <div>
                            <h4 className="font-display font-bold text-xs text-gray-800 dark:text-white uppercase">
                              {plat.name}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-mono block truncate max-w-[280px] sm:max-w-md mt-0.5">
                              {plat.url}
                            </span>
                          </div>
                          <a
                            href={plat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-950 hover:bg-rose-500 dark:hover:bg-rose-500 text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-white text-[11px] font-bold uppercase tracking-wider transition border border-gray-200 dark:border-gray-700 hover:border-rose-500 shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            Join <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-150 dark:border-gray-800 flex justify-end shrink-0">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
                >
                  Close Guidelines
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
