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
  ArrowUp,
  Search,
  BookOpen,
  User,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  CornerDownLeft
} from "lucide-react";

import { Student, Notice, InsiderTopic, AdminSettings, ViewType, safeStorage, safeSessionStorage } from "./types";
import { 
  DEFAULT_STUDENTS, 
  DEFAULT_NOTICES, 
  DEFAULT_INSIDERS, 
  DEFAULT_ADMIN_SETTINGS 
} from "./data/defaultData";
import { supabase } from "./lib/supabaseClient";

import ColorfulRain from "./components/ColorfulRain";
import HomeView from "./components/HomeView";
import OurFamilyView from "./components/OurFamilyView";
import NoticeView from "./components/NoticeView";
import CloudView from "./components/CloudView";
import AcademicToolsView from "./components/AcademicToolsView";
import AdminPanelView from "./components/AdminPanelView";
import Footer from "./components/Footer";
import GreetingToast from "./components/GreetingToast";
import ruetLogo from "./assets/logo";

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("Home");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = safeStorage.getItem("urp_dark_mode");
    return saved ? saved === "true" : false; // Normally set it in light mode view
  });

  // Global Search states
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Global Sync States (initially populated with defaults to guarantee immediate, bug-free rendering, which are updated instantly on successful database connection)
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [insiderTopics, setInsiderTopics] = useState<InsiderTopic[]>(() => {
    return DEFAULT_INSIDERS.map(item => ({
      id: item.id,
      title: item.title,
      short: item.short || "",
      bg: item.bg || "",
      icon: item.icon || "Map",
      content: item.content || "",
      attachments: item.attachments || []
    } as InsiderTopic));
  });
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

  // Greeting Toast Notification States
  const [showGreetingToast, setShowGreetingToast] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState("");

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

  // Greeting Toast Effect
  useEffect(() => {
    const hasGreeted = safeSessionStorage.getItem("urp_has_greeted");
    if (!hasGreeted) {
      const hours = new Date().getHours();
      let greet = "Welcome!";
      if (hours < 12) {
        greet = "Good morning! ☀️";
      } else if (hours < 17) {
        greet = "Good afternoon! 🌤️";
      } else if (hours < 22) {
        greet = "Good evening! 🌌";
      } else {
        greet = "Hello, night owl! 🦉";
      }
      setGreetingMessage(`${greet} Welcome to the RUET URP'25 academic portal. Experience a clean workspace loaded with learning resources!`);
      
      const timer = setTimeout(() => {
        setShowGreetingToast(true);
        safeSessionStorage.setItem("urp_has_greeted", "true");
      }, 1500);

      // Auto-dismiss after 8.5 seconds
      const dismissTimer = setTimeout(() => {
        setShowGreetingToast(false);
      }, 8500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(dismissTimer);
      };
    }
  }, []);

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

  const fetchInsiderTopics = async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*");
    if (!error && data) {
      const parsed = data.map(item => {
        let content = "";
        let attachments: any[] = [];
        try {
          if (item.date && item.date.startsWith("{") && item.date.endsWith("}")) {
            const meta = JSON.parse(item.date);
            content = meta.content || "";
            attachments = meta.attachments || [];
          } else {
            content = item.date || "";
          }
        } catch {
          content = item.date || "";
        }
        return {
          id: item.id,
          title: item.title,
          short: item.caption,
          bg: item.imageUrl,
          icon: item.category,
          content,
          attachments
        } as InsiderTopic;
      });
      setInsiderTopics(parsed);
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
      .select("*");
    if (!error && data && data.length > 0) {
      const mainRow = data.find(r => r.key === "contact_info");
      if (mainRow && mainRow.contacts_json) {
        try {
          const parsed = typeof mainRow.contacts_json === 'string' ? JSON.parse(mainRow.contacts_json) : mainRow.contacts_json;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContactInfo(parsed);
            return;
          }
        } catch (e) {
          console.error("Error parsing contacts_json:", e);
        }
      }

      const filtered = data
        .filter(r => r.key === "contact_info" || r.key.startsWith("contact_info_"))
        .sort((a, b) => {
          if (a.key === "contact_info") return -1;
          if (b.key === "contact_info") return 1;
          return a.key.localeCompare(b.key);
        });

      if (filtered.length > 0) {
        const contactList = filtered.map(item => {
          let title = "General Contact";
          if (item.key.startsWith("contact_info_")) {
            // Reconstruct title from key, e.g. contact_info_1_Web_Support -> "Web Support"
            const parts = item.key.split("_");
            if (parts.length > 3) {
              title = parts.slice(3).join(" ");
            } else {
              title = `Contact ${parts[2] || ""}`;
            }
          } else if (item.email === "sadaturp25@gmail.com" || item.phone === "01750-121454") {
            title = "General Contact";
          }
          return {
            title: title,
            email: item.email || "",
            phone: item.phone || ""
          };
        });
        setContactInfo(contactList);
        return;
      }
    }
    setContactInfo([
      { title: "General Contact", email: "sadaturp25@gmail.com", phone: "01750-121454" }
    ]);
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

      // 3. Seed Insider Topics
      const { data: gals, error: galError } = await supabase.from("gallery_items").select("id");
      if (!galError && (!gals || gals.length === 0)) {
        const payload = DEFAULT_INSIDERS.map(item => ({
          id: item.id,
          title: item.title,
          caption: item.short || "",
          imageUrl: item.bg || "",
          category: item.icon || "Map",
          date: JSON.stringify({
            content: item.content || "",
            attachments: item.attachments || []
          })
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
      fetchInsiderTopics();
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
          fetchInsiderTopics();
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
      fetchInsiderTopics();
      fetchSettings();
      fetchContactInfo();
      fetchOnlinePlatforms();
    }, 8000);

    // Global shortcut to open global search bar
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Keyboard navigation & filtering for global search
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const getSearchResults = () => {
    const query = globalSearchQuery.toLowerCase().trim();
    if (!query) return [];

    const results: {
      type: "Student" | "Notice" | "Gallery" | "AcademicTool";
      title: string;
      subtitle: string;
      meta?: string;
      data: any;
    }[] = [];

    // 1. Search Students
    students.forEach((s) => {
      const name = s.name || "";
      const roll = s.roll || "";
      const bio = s.bio || "";
      if (
        name.toLowerCase().includes(query) ||
        roll.toLowerCase().includes(query) ||
        bio.toLowerCase().includes(query) ||
        (s.tags && s.tags.some(t => t && t.toLowerCase().includes(query)))
      ) {
        results.push({
          type: "Student",
          title: name,
          subtitle: `Roll: ${roll} • ${bio.slice(0, 70)}...`,
          meta: s.tags?.filter(Boolean).join(", ") || "Student Profile",
          data: s,
        });
      }
    });

    // 2. Search Notices
    notices.forEach((n) => {
      const title = n.title || "";
      const content = n.content || "";
      const author = n.author || "";
      if (
        title.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query) ||
        author.toLowerCase().includes(query)
      ) {
        results.push({
          type: "Notice",
          title: title,
          subtitle: content.slice(0, 100) + "...",
          meta: `Notice by ${author} • ${n.date || ""}`,
          data: n,
        });
      }
    });

    // 3. Search Insider Topics
    insiderTopics.forEach((ins) => {
      const title = ins.title || "";
      const short = ins.short || "";
      const content = ins.content || "";
      if (
        title.toLowerCase().includes(query) ||
        short.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query)
      ) {
        results.push({
          type: "InsiderTopic" as any,
          title: title,
          subtitle: short.slice(0, 90) + "...",
          meta: "Insiders Group",
          data: ins,
        });
      }
    });

    // 5. Search Academic Tools
    const staticTools = [
      { name: "Socio-Economic Survey Form Creator", desc: "Form generators and data models for socio-economic field investigations.", path: "Academic Tools" },
      { name: "Urban Density & FAR Calculator", desc: "Calculate Floor Area Ratio, ground coverage, and residential density limits dynamically.", path: "Academic Tools" },
      { name: "Land Use Map Legend Generator", desc: "Generate standardized GIS color legend guides according to RUET department standards.", path: "Academic Tools" },
      { name: "Traffic Flow PCU Calculator", desc: "Convert vehicles to Passenger Car Units (PCU) automatically to analyze road carrying capacity.", path: "Academic Tools" }
    ];
    staticTools.forEach((t) => {
      if (t.name.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query)) {
        results.push({
          type: "AcademicTool",
          title: t.name,
          subtitle: t.desc,
          meta: "Academic Tool Utility",
          data: t,
        });
      }
    });

    return results;
  };

  const searchResults = getSearchResults();

  useEffect(() => {
    setSelectedResultIndex(0);
  }, [globalSearchQuery]);

  const handleSearchResultClick = (result: any) => {
    setGlobalSearchOpen(false);
    setGlobalSearchQuery("");

    if (result.type === "Student") {
      try {
        localStorage.setItem("family_search_init", result.data.roll || result.data.name);
      } catch {}
      handleViewChange("Our Family");
    } else if (result.type === "Notice") {
      try {
        localStorage.setItem("notice_search_init", result.data.title);
      } catch {}
      handleViewChange("Notice");
    } else if (result.type === "InsiderTopic") {
      handleViewChange("Home");
    } else if (result.type === "AcademicTool") {
      handleViewChange("Academic Tools");
    }
  };

  useEffect(() => {
    if (!globalSearchOpen) return;
    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGlobalSearchOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchResults[selectedResultIndex]) {
          handleSearchResultClick(searchResults[selectedResultIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleModalKeyDown);
    return () => window.removeEventListener("keydown", handleModalKeyDown);
  }, [globalSearchOpen, searchResults, selectedResultIndex]);

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
    if (newNotice.is_latest) {
      setNotices(prev => [newNotice, ...prev].map(n => n.id === newNotice.id ? n : { ...n, is_latest: false }));
      try {
        await supabase
          .from("notices")
          .update({ is_latest: false })
          .neq("id", newNotice.id);
      } catch (e) {
        console.warn("Could not reset other notices is_latest status in Supabase:", e);
      }
    } else {
      setNotices(prev => [newNotice, ...prev]);
    }

    const { error } = await supabase.from("notices").insert({
      id: newNotice.id,
      title: newNotice.title,
      content: newNotice.content,
      date: newNotice.date,
      author: newNotice.author,
      attachments: newNotice.attachments,
      publish_date: newNotice.publish_date || null,
      publish_time: newNotice.publish_time || null,
      is_latest: newNotice.is_latest || false
    });
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

  const handleUpdateNotice = async (notice: Notice) => {
    if (notice.is_latest) {
      setNotices(prev => prev.map(n => n.id === notice.id ? notice : { ...n, is_latest: false }));
      try {
        await supabase
          .from("notices")
          .update({ is_latest: false })
          .neq("id", notice.id);
      } catch (e) {
        console.warn("Could not reset other notices is_latest status in Supabase:", e);
      }
    } else {
      setNotices(prev => prev.map(n => n.id === notice.id ? notice : n));
    }

    const { error } = await supabase
      .from("notices")
      .update({
        title: notice.title,
        content: notice.content,
        date: notice.date,
        author: notice.author,
        attachments: notice.attachments,
        publish_date: notice.publish_date || null,
        publish_time: notice.publish_time || null,
        is_latest: notice.is_latest || false
      })
      .eq("id", notice.id);
    if (error) {
      console.error("Supabase update notice error:", error.message);
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

  const handleAddInsiderTopic = async (topic: InsiderTopic) => {
    setInsiderTopics(prev => [topic, ...prev]);
    const { error } = await supabase.from("gallery_items").insert({
      id: topic.id,
      title: topic.title,
      caption: topic.short,
      imageUrl: topic.bg || "",
      category: topic.icon || "Map",
      date: JSON.stringify({
        content: topic.content,
        attachments: topic.attachments || []
      })
    });
    if (error) {
      console.error("Supabase insert insider topic error:", error.message);
    }
  };

  const handleUpdateInsiderTopic = async (topic: InsiderTopic) => {
    setInsiderTopics(prev => prev.map(t => t.id === topic.id ? topic : t));
    const { error } = await supabase
      .from("gallery_items")
      .update({
        title: topic.title,
        caption: topic.short,
        imageUrl: topic.bg || "",
        category: topic.icon || "Map",
        date: JSON.stringify({
          content: topic.content,
          attachments: topic.attachments || []
        })
      })
      .eq("id", topic.id);
    if (error) {
      console.error("Supabase update insider topic error:", error.message);
    }
  };

  const handleDeleteInsiderTopic = async (id: string) => {
    setInsiderTopics(prev => prev.filter(t => t.id !== id));
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete insider topic error:", error.message);
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
    
    // 1. Try upsert with contacts_json first (best case)
    const { error } = await supabase
      .from("contact_info")
      .upsert({
        key: "contact_info",
        email: contactsList[0]?.email || "",
        phone: contactsList[0]?.phone || "",
        contacts_json: contactsList
      });

    if (error) {
      console.warn("Upsert with contacts_json failed, retrying with multi-row fallback:", error.message);
      
      try {
        // 2. Fetch existing contact keys and delete supplementary contact_info_ rows
        const { data: existingRows } = await supabase.from("contact_info").select("key");
        if (existingRows) {
          const extraKeys = existingRows.map(r => r.key).filter(k => k.startsWith("contact_info_"));
          if (extraKeys.length > 0) {
            await supabase.from("contact_info").delete().in("key", extraKeys);
          }
        }

        // 3. Upsert primary row
        await supabase
          .from("contact_info")
          .upsert({
            key: "contact_info",
            email: contactsList[0]?.email || "",
            phone: contactsList[0]?.phone || ""
          });

        // 4. Upsert extra rows for secondary contacts
        for (let i = 1; i < contactsList.length; i++) {
          const c = contactsList[i];
          const titleSlug = (c.title || `Contact ${i}`).replace(/[^a-zA-Z0-9]/g, "_");
          await supabase
            .from("contact_info")
            .upsert({
              key: `contact_info_${i}_${titleSlug}`,
              email: c.email || "",
              phone: c.phone || ""
            });
        }
      } catch (fallbackErr: any) {
        console.error("Multi-row fallback contact save failed:", fallbackErr.message);
      }
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

  const handleViewChange = (view: any) => {
    if (view === "Gallery") {
      window.open("https://sites.google.com/view/ruet-urp-25-gallery/home", "_blank");
      setMobileMenuOpen(false);
      return;
    }
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
            {(["Home", "Our Family", "Notice", "Cloud", "Academic Tools", "Gallery"] as any[]).map((view) => {
              if (view === "Gallery") {
                return (
                  <a
                    key={view}
                    href="https://sites.google.com/view/ruet-urp-25-gallery/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-bahnschrift font-semibold tracking-wider uppercase transition-colors relative py-1 cursor-pointer text-stone-500 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-500"
                  >
                    Gallery
                  </a>
                );
              }
              return (
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
              );
            })}

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
              onClick={() => setGlobalSearchOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold uppercase tracking-wider group"
              title="Global Search (Press '/' to search)"
            >
              <Search className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-stone-500 dark:text-stone-400 font-mono text-[9px] lowercase bg-stone-200/60 dark:bg-stone-800/80 px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700">/</span>
            </button>

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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGlobalSearchOpen(true);
                }}
                className="flex items-center gap-2.5 text-sm font-bahnschrift font-semibold tracking-widest uppercase py-2 text-left text-rose-500 border-b border-gray-100 dark:border-zinc-900 cursor-pointer"
              >
                <Search className="w-4 h-4 text-rose-500" />
                <span>Search Website</span>
              </button>

              {(["Home", "Our Family", "Notice", "Cloud", "Academic Tools", "Gallery"] as any[]).map((view) => {
                if (view === "Gallery") {
                  return (
                    <a
                      key={view}
                      href="https://sites.google.com/view/ruet-urp-25-gallery/home"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bahnschrift font-semibold tracking-widest uppercase transition-colors py-2 text-left border-b border-gray-100 dark:border-zinc-900 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-rose-500 block"
                    >
                      Gallery
                    </a>
                  );
                }
                return (
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
                );
              })}

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
      <main className={`flex-1 w-full relative z-10 ${activeView === "Home" ? "-mt-16" : "px-4 sm:px-6 md:px-12 py-8 sm:py-10"}`}>
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
                insiders={insiderTopics}
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
                onViewImage={(src, alt) => setLightboxImage({ src, alt })}
              />
            )}

            {activeView === "Cloud" && (
              <CloudView />
            )}

            {activeView === "Academic Tools" && (
              <AcademicToolsView />
            )}

            {activeView === "Admin Panel" && (
              <AdminPanelView
                isAuthenticated={isAuthenticated}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                notices={notices}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
                onUpdateNotice={handleUpdateNotice}
                students={students}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudent={handleUpdateStudent}
                insiders={insiderTopics}
                onAddInsiderTopic={handleAddInsiderTopic}
                onDeleteInsiderTopic={handleDeleteInsiderTopic}
                onUpdateInsiderTopic={handleUpdateInsiderTopic}
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

      {/* Global Command+K Search Modal */}
      <AnimatePresence>
        {globalSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/45 dark:bg-black/75 backdrop-blur-md z-50 flex items-start justify-center p-4 sm:p-10 md:p-20 overflow-y-auto"
            onClick={() => setGlobalSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-[#0C0A09] border border-stone-200 dark:border-stone-850 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh] mt-10 md:mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Bar Input */}
              <div className="relative border-b border-stone-100 dark:border-stone-900 p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-rose-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Type roll, teacher, name, subject, notice content..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none py-1"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setGlobalSearchOpen(false);
                    setGlobalSearchQuery("");
                  }}
                  className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-mono border border-stone-200 dark:border-stone-850 shrink-0 cursor-pointer animate-pulse"
                  title="Close Search"
                >
                  [Esc]
                </button>
              </div>

              {/* Scrollable Search Results Area */}
              <div className="overflow-y-auto p-4 space-y-3 flex-1 min-h-[150px] max-h-[60vh] text-left">
                {globalSearchQuery.trim() === "" ? (
                  <div className="py-10 text-center text-stone-400 dark:text-stone-500 space-y-3">
                    <Search className="w-10 h-10 text-stone-300 dark:text-stone-800 mx-auto animate-pulse" />
                    <p className="text-xs font-mono font-medium uppercase tracking-wider text-rose-500">Search Portal of RUET URP'25</p>
                    <p className="text-[11px] max-w-xs mx-auto leading-relaxed font-arial text-stone-400">
                      Search student profiles by roll/name, notice bulletins, teacher titles, and class lecture materials instantly.
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-2 pb-2 text-[10px] font-mono font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest border-b border-stone-100 dark:border-stone-900/50">
                      Search Results ({searchResults.length})
                    </div>
                    
                    {searchResults.map((res, index) => {
                      const isSelected = index === selectedResultIndex;
                      return (
                        <div
                          key={index}
                          onClick={() => handleSearchResultClick(res)}
                          className={`p-3.5 rounded-2xl border transition duration-150 flex items-start gap-3 cursor-pointer group ${
                            isSelected
                              ? "bg-rose-500/5 border-rose-500/25 dark:border-rose-500/30"
                              : "bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-900/50"
                          }`}
                        >
                          {/* Left Icon depending on search result type */}
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            isSelected
                              ? "bg-white dark:bg-stone-900 border-rose-200 dark:border-rose-900/50 shadow-sm"
                              : "bg-stone-50 dark:bg-stone-900 border-stone-150 dark:border-stone-800"
                          }`}>
                            {res.type === "Student" && <User className="w-4 h-4 text-rose-500" />}
                            {res.type === "Notice" && <FileText className="w-4 h-4 text-orange-500" />}
                            {res.type === "Gallery" && <ImageIcon className="w-4 h-4 text-emerald-500" />}
                            {res.type === "AcademicTool" && <Compass className="w-4 h-4 text-purple-500" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 justify-between">
                              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                                {res.title}
                              </span>
                              <span className="text-[9px] font-mono font-bold bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-stone-500 uppercase tracking-widest shrink-0">
                                {res.type}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-normal font-arial line-clamp-1">
                              {res.subtitle}
                            </p>
                            {res.meta && (
                              <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 mt-1 uppercase tracking-wider truncate">
                                {res.meta}
                              </div>
                            )}
                          </div>

                          {/* Arrow or feedback */}
                          <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 text-rose-500 animate-bounce-right" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-stone-400 dark:text-stone-500">
                    <X className="w-8 h-8 text-rose-500/30 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-bold text-stone-600 dark:text-stone-300">No results found for "{globalSearchQuery}"</p>
                    <p className="text-[11px] mt-1 font-arial text-stone-500">Try searching roll numbers (e.g. 2017001), teacher names, or planning terms.</p>
                  </div>
                )}
              </div>

              {/* Footer details */}
              <div className="p-3 bg-stone-50 dark:bg-stone-900/30 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between text-[10px] font-mono text-stone-400 dark:text-stone-500 px-4 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 shadow-sm text-[8px] font-bold">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 shadow-sm text-[8px] font-bold">Enter</kbd> Open
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  Powered by <span className="text-rose-500 font-bold">RUET URP'25</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polish Greeting Toast */}
      <AnimatePresence>
        {showGreetingToast && (
          <GreetingToast 
            message={greetingMessage} 
            onClose={() => setShowGreetingToast(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
