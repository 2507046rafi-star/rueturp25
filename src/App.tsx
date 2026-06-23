import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronRight, 
  Star, 
  Award, 
  Compass, 
  HelpCircle,
  Sparkles,
  ArrowUp
} from "lucide-react";

import { Student, Notice, GalleryItem, AdminSettings, ViewType, safeStorage, safeSessionStorage } from "./types";
import { 
  DEFAULT_STUDENTS, 
  DEFAULT_NOTICES, 
  DEFAULT_GALLERY, 
  DEFAULT_ADMIN_SETTINGS 
} from "./data/defaultData";

import ColorfulRain from "./components/ColorfulRain";
import HomeView from "./components/HomeView";
import OurFamilyView from "./components/OurFamilyView";
import NoticeView from "./components/NoticeView";
import CloudView from "./components/CloudView";
import AcademicToolsView from "./components/AcademicToolsView";
import GalleryView from "./components/GalleryView";
import AdminPanelView from "./components/AdminPanelView";
import Footer from "./components/Footer";

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = safeStorage.getItem("urp_dark_mode");
    return saved ? saved === "true" : false; // Normally set it in light mode view
  });

  // Global Sync States
  const [students, setStudents] = useState<Student[]>(() => {
    return safeStorage.parseItem<Student[]>("urp_students", DEFAULT_STUDENTS);
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    return safeStorage.parseItem<Notice[]>("urp_notices", DEFAULT_NOTICES);
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    return safeStorage.parseItem<GalleryItem[]>("urp_gallery", DEFAULT_GALLERY);
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    return safeStorage.parseItem<AdminSettings>("urp_settings", DEFAULT_ADMIN_SETTINGS);
  });

  const [contactInfo, setContactInfo] = useState<{ email: string; phone: string }>(() => {
    return safeStorage.parseItem<{ email: string; phone: string }>("urp_contact", { email: "sadaturp25@gmail.com", phone: "01750-121454" });
  });

  const [onlinePlatforms, setOnlinePlatforms] = useState<{ name: string; url: string }[]>(() => {
    return safeStorage.parseItem<{ name: string; url: string }[]>("urp_platforms", [
      { name: "RUET URP'25 Facebook Group", url: "https://www.facebook.com/groups/urp25ruet" },
      { name: "Official Department Website", url: "https://www.urp.ruet.ac.bd/" },
      { name: "URP Association Portal", url: "https://www.urp.ruet.ac.bd/notice" }
    ]);
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = safeSessionStorage.getItem("urp_admin_auth");
    return saved === "true";
  });

  // Back to Top State
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Apply dark mode classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    safeStorage.setItem("urp_dark_mode", String(darkMode));
  }, [darkMode]);

  // Handle Back to Top Button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Admin Session Handlers
  const handleAdminLogin = (pass: string): boolean => {
    // The secure passcode as requested, developer-changeable
    if (pass === "U$r@p%RUET") {
      setIsAuthenticated(true);
      safeSessionStorage.setItem("urp_admin_auth", "true");
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    safeSessionStorage.removeItem("urp_admin_auth");
  };

  // State update helpers with LocalStorage persistent sync
  const handleAddNotice = (newNotice: Notice) => {
    const updated = [newNotice, ...notices];
    setNotices(updated);
    safeStorage.setItem("urp_notices", JSON.stringify(updated));
  };

  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    safeStorage.setItem("urp_notices", JSON.stringify(updated));
  };

  const handleAddStudent = (newStudent: Student) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    safeStorage.setItem("urp_students", JSON.stringify(updated));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.roll === updatedStudent.roll ? updatedStudent : s);
    setStudents(updated);
    safeStorage.setItem("urp_students", JSON.stringify(updated));
  };

  const handleDeleteStudent = (roll: string) => {
    const updated = students.filter(s => s.roll !== roll);
    setStudents(updated);
    safeStorage.setItem("urp_students", JSON.stringify(updated));
  };

  const handleAddGalleryItem = (newItem: GalleryItem) => {
    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    safeStorage.setItem("urp_gallery", JSON.stringify(updated));
  };

  const handleEditGalleryItem = (updatedItem: GalleryItem) => {
    const updated = galleryItems.map(item => item.id === updatedItem.id ? updatedItem : item);
    setGalleryItems(updated);
    safeStorage.setItem("urp_gallery", JSON.stringify(updated));
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updated = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updated);
    safeStorage.setItem("urp_gallery", JSON.stringify(updated));
  };

  const handleUpdateSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
    safeStorage.setItem("urp_settings", JSON.stringify(settings));
  };

  const handleUpdateContactInfo = (info: { email: string; phone: string }) => {
    setContactInfo(info);
    safeStorage.setItem("urp_contact", JSON.stringify(info));
  };

  const handleUpdateOnlinePlatforms = (platforms: { name: string; url: string }[]) => {
    setOnlinePlatforms(platforms);
    safeStorage.setItem("urp_platforms", JSON.stringify(platforms));
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden bg-[#FAFAF9] dark:bg-[#0C0A09] text-stone-900 dark:text-[#FAFAF9] transition-colors duration-500 selection:bg-rose-500 selection:text-white">
      
      {/* Global Colorful Rain Backdrop */}
      <ColorfulRain />

      {/* SpaceX Inspired Header */}
      <header className="sticky top-0 z-40 glass-nav transition-colors duration-300">
        <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
          
          {/* Logo / Web Title */}
          <button 
            onClick={() => handleViewChange("Home")}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 bg-rose-600 rounded-sm flex items-center justify-center text-white font-bold tracking-tighter group-hover:scale-105 transition-transform">
              U
            </div>
            <span className="font-display font-bold text-lg tracking-tighter uppercase text-gray-950 dark:text-white">
              RUET URP'25
            </span>
          </button>

          {/* Desktop Menu - SpaceX inspired minimalist uppercase text */}
          <nav className="hidden md:flex items-center gap-8">
            {(["Home", "Our Family", "Notice", "Cloud", "Academic Tools", "Gallery"] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`text-[15px] font-bold tracking-wider uppercase transition-colors relative py-1 cursor-pointer ${
                  activeView === view 
                    ? "text-rose-600 font-extrabold" 
                    : "text-stone-500 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-500"
                }`}
              >
                {view}
                {activeView === view && (
                  <motion.div 
                    layoutId="activeIndicator" 
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-600" 
                  />
                )}
              </button>
            ))}

            <button
              onClick={() => handleViewChange("Admin Panel")}
              className={`text-[15px] font-bold tracking-wider uppercase px-4 py-2 rounded transition cursor-pointer flex items-center gap-1 ${
                activeView === "Admin Panel"
                  ? "bg-rose-600 text-white font-extrabold border-rose-600"
                  : "bg-transparent border border-stone-250 dark:border-stone-700 text-stone-500 dark:text-stone-300 hover:border-rose-600 hover:text-rose-600"
              }`}
            >
              Admin Panel
            </button>
          </nav>

          {/* Theme Switcher & Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-900 z-30 py-6 px-6 space-y-4 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4 text-left">
              {(["Home", "Our Family", "Notice", "Cloud", "Academic Tools", "Gallery"] as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`text-sm font-bold tracking-widest uppercase transition-colors py-2 text-left border-b border-gray-100 dark:border-zinc-900 cursor-pointer ${
                    activeView === view 
                      ? "text-rose-500" 
                      : "text-gray-600 dark:text-gray-300 hover:text-rose-500"
                  }`}
                >
                  {view}
                </button>
              ))}

              <button
                onClick={() => handleViewChange("Admin Panel")}
                className={`text-sm font-bold tracking-widest uppercase py-3 px-4 rounded-xl text-center border transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeView === "Admin Panel"
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200"
                }`}
              >
                Admin Panel Directory
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Animated Switcher */}
      <main className="flex-1 w-full px-6 md:px-12 py-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 80, scale: 0.97, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -80, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeView === "Home" && (
              <HomeView 
                notices={notices} 
                students={students} 
                onNavigate={handleViewChange} 
              />
            )}

            {activeView === "Our Family" && (
              <OurFamilyView 
                students={students} 
              />
            )}

            {activeView === "Notice" && (
              <NoticeView 
                notices={notices} 
              />
            )}

            {activeView === "Cloud" && (
              <CloudView />
            )}

            {activeView === "Academic Tools" && (
              <AcademicToolsView />
            )}

            {activeView === "Gallery" && (
              <GalleryView 
                galleryItems={galleryItems} 
                isAdmin={isAuthenticated}
                onDeleteGalleryItem={handleDeleteGalleryItem}
                onEditGalleryItem={handleEditGalleryItem}
              />
            )}

            {activeView === "Admin Panel" && (
              <AdminPanelView
                isAuthenticated={isAuthenticated}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                notices={notices}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
                students={students}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudent={handleUpdateStudent}
                galleryItems={galleryItems}
                onAddGalleryItem={handleAddGalleryItem}
                onDeleteGalleryItem={handleDeleteGalleryItem}
                adminSettings={adminSettings}
                onUpdateSettings={handleUpdateSettings}
                contactInfo={contactInfo}
                onUpdateContactInfo={handleUpdateContactInfo}
                onlinePlatforms={onlinePlatforms}
                onUpdateOnlinePlatforms={handleUpdateOnlinePlatforms}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition duration-300 z-40 hover:-translate-y-1 cursor-pointer"
            title="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Interactive Footer */}
      <Footer 
        contactInfo={contactInfo}
        adminSettings={adminSettings}
        onlinePlatforms={onlinePlatforms}
        onNavigate={handleViewChange}
      />
    </div>
  );
}
