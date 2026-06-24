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
import { supabase } from "./lib/supabaseClient";

import ColorfulRain from "./components/ColorfulRain";
import HomeView from "./components/HomeView";
import OurFamilyView from "./components/OurFamilyView";
import NoticeView from "./components/NoticeView";
import CloudView from "./components/CloudView";
import AcademicToolsView from "./components/AcademicToolsView";
import GalleryView from "./components/GalleryView";
import AdminPanelView from "./components/AdminPanelView";
import NoteParkView from "./components/NoteParkView";
import Footer from "./components/Footer";
import ruetLogo from "./assets/images/ruet_urp_logo_1782301017782.jpg";

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("Home");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = safeStorage.getItem("urp_dark_mode");
    return saved ? saved === "true" : false; // Normally set it in light mode view
  });

  // Global Sync States (initially fallback to defaults, populated dynamically from Supabase)
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [contactInfo, setContactInfo] = useState<{ title?: string; email: string; phone: string }[]>([
    { title: "General Contact", email: "sadaturp25@gmail.com", phone: "01750-121454" },
    { title: "For any website related problems or any technical help of RUET URP'25", email: "rafitoday2007@gmail.com", phone: "01619871136" }
  ]);
  const [onlinePlatforms, setOnlinePlatforms] = useState<{ name: string; url: string }[]>([
    { name: "RUET URP'25 Facebook Group", url: "https://www.facebook.com/groups/urp25ruet" },
    { name: "Official Department Website", url: "https://www.urp.ruet.ac.bd/" },
    { name: "URP Association Portal", url: "https://www.urp.ruet.ac.bd/notice" }
  ]);

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

  // Fetch functions for Supabase data fetching
  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) {
      setNotices(data as Notice[]);
    }
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("roll", { ascending: true });
    if (!error && data) {
      setStudents(data as Student[]);
    }
  };

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) {
      setGalleryItems(data.map(item => ({
        id: item.id,
        title: item.title,
        caption: item.caption,
        imageUrl: item.imageUrl,
        category: item.category as "Academic" | "Extra-curriculum",
        date: item.date
      })));
    }
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("key", "global_settings")
      .maybeSingle();
    if (!error && data) {
      setAdminSettings({
        aboutUs: data.aboutUs,
        aboutUsImage: data.aboutUsImage,
        policy: data.policy
      });
    }
  };

  const fetchContactInfo = async () => {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("key", "contact_info")
      .maybeSingle();
    if (!error && data) {
      if (data.contacts_json) {
        try {
          const parsed = typeof data.contacts_json === 'string' ? JSON.parse(data.contacts_json) : data.contacts_json;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContactInfo(parsed);
            return;
          }
        } catch (e) {
          console.error("Error parsing contacts_json:", e);
        }
      }
      setContactInfo([
        { title: "General Contact", email: data.email || "sadaturp25@gmail.com", phone: data.phone || "01750-121454" }
      ]);
    }
  };

  const fetchOnlinePlatforms = async () => {
    const { data, error } = await supabase
      .from("online_platforms")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) {
      setOnlinePlatforms(data.map(p => ({ name: p.name, url: p.url })));
    }
  };

  // Seeding function to populate Supabase tables with initial data if they are empty
  const seedDatabase = async () => {
    try {
      // 1. Seed students
      const { data: stds, error: stdError } = await supabase.from("students").select("roll");
      if (!stdError && (!stds || stds.length === 0)) {
        await supabase.from("students").insert(DEFAULT_STUDENTS);
      }

      // 2. Seed notices
      const { data: nots, error: notError } = await supabase.from("notices").select("id");
      if (!notError && (!nots || nots.length === 0)) {
        await supabase.from("notices").insert(DEFAULT_NOTICES);
      }

      // 3. Seed gallery items
      const { data: gals, error: galError } = await supabase.from("gallery_items").select("id");
      if (!galError && (!gals || gals.length === 0)) {
        const payload = DEFAULT_GALLERY.map(item => ({
          id: item.id,
          title: item.title,
          caption: item.caption,
          imageUrl: item.imageUrl,
          category: item.category,
          date: item.date
        }));
        await supabase.from("gallery_items").insert(payload);
      }

      // 4. Seed admin settings
      const { data: sets, error: setStrError } = await supabase.from("admin_settings").select("key");
      if (!setStrError && (!sets || sets.length === 0)) {
        await supabase.from("admin_settings").insert({
          key: "global_settings",
          aboutUs: DEFAULT_ADMIN_SETTINGS.aboutUs,
          aboutUsImage: DEFAULT_ADMIN_SETTINGS.aboutUsImage,
          policy: DEFAULT_ADMIN_SETTINGS.policy
        });
      }

      // 5. Seed contact info
      const { data: contacts, error: contactError } = await supabase.from("contact_info").select("key");
      if (!contactError && (!contacts || contacts.length === 0)) {
        await supabase.from("contact_info").insert({
          key: "contact_info",
          email: "sadaturp25@gmail.com",
          phone: "01750-121454"
        });
      }

      // 6. Seed online platforms
      const { data: platforms, error: platError } = await supabase.from("online_platforms").select("id");
      if (!platError && (!platforms || platforms.length === 0)) {
        const defaultPlatforms = [
          { id: "plat-1", name: "RUET URP'25 Facebook Group", url: "https://www.facebook.com/groups/urp25ruet" },
          { id: "plat-2", name: "Official Department Website", url: "https://www.urp.ruet.ac.bd/" },
          { id: "plat-3", name: "URP Association Portal", url: "https://www.urp.ruet.ac.bd/notice" }
        ];
        await supabase.from("online_platforms").insert(defaultPlatforms);
      }
    } catch (e) {
      console.warn("Database automatic seed check skipped:", e);
    } finally {
      // Always pull values
      fetchNotices();
      fetchStudents();
      fetchGallery();
      fetchSettings();
      fetchContactInfo();
      fetchOnlinePlatforms();
    }
  };

  // Run on mount to seed database and listen for real-time changes
  useEffect(() => {
    seedDatabase();

    const channel = supabase
      .channel("supabase_changes_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notices" },
        () => {
          fetchNotices();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => {
          fetchStudents();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_items" },
        () => {
          fetchGallery();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_settings" },
        () => {
          fetchSettings();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_info" },
        () => {
          fetchContactInfo();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "online_platforms" },
        () => {
          fetchOnlinePlatforms();
        }
      )
      .subscribe();

    // Background interval fallback polling (every 8 seconds) for perfect sync if network drops or sockets disconnect
    const pollInterval = setInterval(() => {
      fetchNotices();
      fetchStudents();
      fetchGallery();
      fetchSettings();
      fetchContactInfo();
      fetchOnlinePlatforms();
    }, 8000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  // Admin Session Handlers
  const handleAdminLogin = (pass: string): boolean => {
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

  // State update helpers writing directly to Supabase DB
  const handleAddNotice = async (newNotice: Notice) => {
    setNotices(prev => [newNotice, ...prev]);
    const { error } = await supabase.from("notices").insert(newNotice);
    if (error) {
      console.error("Supabase insert notice error:", error.message);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete notice error:", error.message);
    }
  };

  const handleAddStudent = async (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    const { error } = await supabase.from("students").insert(newStudent);
    if (error) {
      console.error("Supabase insert student error:", error.message);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.roll === updatedStudent.roll ? updatedStudent : s));
    const { error } = await supabase
      .from("students")
      .update(updatedStudent)
      .eq("roll", updatedStudent.roll);
    if (error) {
      console.error("Supabase update student error:", error.message);
    }
  };

  const handleDeleteStudent = async (roll: string) => {
    setStudents(prev => prev.filter(s => s.roll !== roll));
    const { error } = await supabase.from("students").delete().eq("roll", roll);
    if (error) {
      console.error("Supabase delete student error:", error.message);
    }
  };

  const handleAddGalleryItem = async (newItem: GalleryItem) => {
    setGalleryItems(prev => [newItem, ...prev]);
    const { error } = await supabase.from("gallery_items").insert({
      id: newItem.id,
      title: newItem.title,
      caption: newItem.caption,
      imageUrl: newItem.imageUrl,
      category: newItem.category,
      date: newItem.date
    });
    if (error) {
      console.error("Supabase insert gallery error:", error.message);
    }
  };

  const handleEditGalleryItem = async (updatedItem: GalleryItem) => {
    setGalleryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    const { error } = await supabase
      .from("gallery_items")
      .update({
        title: updatedItem.title,
        caption: updatedItem.caption,
        imageUrl: updatedItem.imageUrl,
        category: updatedItem.category,
        date: updatedItem.date
      })
      .eq("id", updatedItem.id);
    if (error) {
      console.error("Supabase update gallery error:", error.message);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete gallery error:", error.message);
    }
  };

  const handleUpdateSettings = async (settings: AdminSettings) => {
    setAdminSettings(settings);
    const { error } = await supabase
      .from("admin_settings")
      .upsert({
        key: "global_settings",
        aboutUs: settings.aboutUs,
        aboutUsImage: settings.aboutUsImage,
        policy: settings.policy
      });
    if (error) {
      console.error("Supabase update settings error:", error.message);
    }
  };

  const handleUpdateContactInfo = async (contactsList: { title?: string; email: string; phone: string }[]) => {
    setContactInfo(contactsList);
    const { error } = await supabase
      .from("contact_info")
      .upsert({
        key: "contact_info",
        email: contactsList[0]?.email || "",
        phone: contactsList[0]?.phone || "",
        contacts_json: contactsList
      });
    if (error) {
      console.error("Supabase update contact info error:", error.message);
    }
  };

  const handleUpdateOnlinePlatforms = async (platforms: { name: string; url: string }[]) => {
    setOnlinePlatforms(platforms);
    try {
      // First, purge existing
      await supabase.from("online_platforms").delete().neq("id", "none");
      // Then write the new ones
      const payload = platforms.map((p, idx) => ({
        id: `plat-${idx + 1}`,
        name: p.name,
        url: p.url
      }));
      const { error } = await supabase.from("online_platforms").insert(payload);
      if (error) {
        console.error("Supabase insert online platforms error:", error.message);
      }
    } catch (e) {
      console.error("Error updating online platforms on Supabase:", e);
    }
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
          <div className="flex items-center gap-2.5 group text-left">
            <img 
              src={ruetLogo} 
              alt="RUET URP Logo" 
              className="w-10 h-10 object-contain hover:scale-105 transition-transform rounded-full cursor-pointer"
              referrerPolicy="no-referrer"
              onClick={() => setLightboxImage({ src: ruetLogo, alt: "RUET URP Logo" })}
              title="Click to view full logo"
            />
            <button 
              onClick={() => handleViewChange("Home")}
              className="font-bahnschrift font-bold text-lg tracking-tighter uppercase text-stone-900 dark:text-white cursor-pointer hover:text-rose-600 dark:hover:text-rose-500 transition-colors"
            >
              RUET URP'25
            </button>
          </div>

          {/* Desktop Menu - SpaceX inspired minimalist uppercase text */}
          <nav className="hidden md:flex items-center gap-8">
            {(["Home", "Our Family", "Notice", "Cloud", "Academic Tools", "Gallery", "NotePark"] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`text-[15px] font-bahnschrift font-semibold tracking-wider uppercase transition-colors relative py-1 cursor-pointer ${
                  activeView === view 
                    ? "text-rose-600 font-bold" 
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
              className={`text-[15px] font-bahnschrift font-semibold tracking-wider uppercase transition-colors relative py-1 cursor-pointer ${
                activeView === "Admin Panel"
                  ? "text-rose-600 font-bold"
                  : "text-stone-500 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-500"
              }`}
            >
              Admin Panel
              {activeView === "Admin Panel" && (
                <motion.div 
                  layoutId="activeIndicator" 
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-600" 
                />
              )}
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
              {(["Home", "Our Family", "Notice", "Cloud", "Academic Tools", "Gallery", "NotePark"] as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`text-sm font-bahnschrift font-semibold tracking-widest uppercase transition-colors py-2 text-left border-b border-gray-100 dark:border-zinc-900 cursor-pointer ${
                    activeView === view 
                      ? "text-rose-500 font-bold" 
                      : "text-gray-600 dark:text-gray-300 hover:text-rose-500"
                  }`}
                >
                  {view}
                </button>
              ))}

              <button
                onClick={() => handleViewChange("Admin Panel")}
                className={`text-sm font-bahnschrift font-semibold tracking-widest uppercase py-2 text-left border-b border-gray-100 dark:border-zinc-900 cursor-pointer ${
                  activeView === "Admin Panel"
                    ? "text-rose-500 font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-rose-500"
                }`}
              >
                Admin Panel
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
                onViewImage={(src, alt) => setLightboxImage({ src, alt })}
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

            {activeView === "NotePark" && (
              <NoteParkView 
                isAdmin={isAuthenticated} 
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

      {/* Global Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
              title="Close Image"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-stone-950 flex flex-col items-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                referrerPolicy="no-referrer"
                className="w-full max-h-[75vh] object-contain select-none rounded-t-2xl"
              />
              <div className="w-full p-4 bg-stone-900 border-t border-white/5 text-center text-xs font-mono text-gray-300">
                <span className="font-bold text-white uppercase tracking-wider">{lightboxImage.alt}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
