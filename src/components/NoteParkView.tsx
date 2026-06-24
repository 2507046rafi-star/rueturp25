import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
  Paperclip, 
  ExternalLink, 
  Search, 
  ArrowUpDown, 
  Save, 
  X,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Image,
  Link,
  ChevronRight,
  Sparkles,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { NoteParkItem, safeStorage } from "../types";
import { supabase } from "../lib/supabaseClient";

interface NoteParkViewProps {
  isAdmin: boolean;
}

export default function NoteParkView({ isAdmin }: NoteParkViewProps) {
  const [notes, setNotes] = useState<NoteParkItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      return localStorage.getItem("notepark_search_init") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.removeItem("notepark_search_init");
    } catch {}
  }, []);
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "subject">("date-desc");

  // Note form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [classDate, setClassDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [classPeriod, setClassPeriod] = useState("");
  const [classTeacher, setClassTeacher] = useState("");
  
  // Attachments form builder
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentType, setAttachmentType] = useState<"file" | "photo" | "link">("file");
  const [attachmentsList, setAttachmentsList] = useState<{ name: string; url: string; type: "file" | "photo" | "link" }[]>([]);

  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save draft timer & state
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch Notes from Supabase
  const fetchNotes = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("note_park")
        .select("*")
        .order("class_date", { ascending: false });

      if (!error && data) {
        setNotes(data as NoteParkItem[]);
      } else {
        console.error("Error fetching notes:", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    // Subscribe to note_park changes
    const noteParkChannel = supabase
      .channel("note_park_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "note_park" },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    // Load form draft if any
    const savedDraft = safeStorage.parseItem<{
      classDate: string;
      classTime: string;
      subjectName: string;
      classPeriod: string;
      classTeacher: string;
      attachmentsList: any[];
    }>("note_park_form_draft", {
      classDate: "",
      classTime: "",
      subjectName: "",
      classPeriod: "",
      classTeacher: "",
      attachmentsList: []
    });

    if (savedDraft) {
      setClassDate(savedDraft.classDate || "");
      setClassTime(savedDraft.classTime || "");
      setSubjectName(savedDraft.subjectName || "");
      setClassPeriod(savedDraft.classPeriod || "");
      setClassTeacher(savedDraft.classTeacher || "");
      setAttachmentsList(savedDraft.attachmentsList || []);
    }

    return () => {
      supabase.removeChannel(noteParkChannel);
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  // 2. Draft Auto-Saving Logic
  useEffect(() => {
    // Debounce auto-save
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      if (!editingId && (classDate || classTime || subjectName || classPeriod || classTeacher || attachmentsList.length > 0)) {
        safeStorage.setItem("note_park_form_draft", JSON.stringify({
          classDate,
          classTime,
          subjectName,
          classPeriod,
          classTeacher,
          attachmentsList
        }));
      }
    }, 1000);
  }, [classDate, classTime, subjectName, classPeriod, classTeacher, attachmentsList, editingId]);

  // Add attachment to the current note draft
  const handleAddAttachment = () => {
    if (!attachmentName.trim() || !attachmentUrl.trim()) {
      setFormError("Both attachment name and URL/Link are required.");
      return;
    }
    // Simple URL validity look
    if (!attachmentUrl.startsWith("http://") && !attachmentUrl.startsWith("https://")) {
      setFormError("Attachment link must be a valid HTTP or HTTPS URL.");
      return;
    }

    setAttachmentsList(prev => [...prev, {
      name: attachmentName.trim(),
      url: attachmentUrl.trim(),
      type: attachmentType
    }]);

    // Reset attachments fields
    setAttachmentName("");
    setAttachmentUrl("");
    setFormError("");
  };

  // Remove attachment from list
  const handleRemoveAttachment = (idx: number) => {
    setAttachmentsList(prev => prev.filter((_, i) => i !== idx));
  };

  // 3. Create or Update Note
  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classDate || !classTime || !subjectName || !classPeriod || !classTeacher) {
      setFormError("All fields except attachments are strictly required.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setSuccessMsg("");

    try {
      if (editingId) {
        // Update Note
        const { error } = await supabase
          .from("note_park")
          .update({
            class_date: classDate,
            class_time: classTime,
            subject_name: subjectName,
            class_period: classPeriod,
            class_teacher: classTeacher,
            attachments: attachmentsList
          })
          .eq("id", editingId);

        if (!error) {
          setSuccessMsg("Class note successfully updated!");
          resetForm();
          fetchNotes();
        } else {
          setFormError("Failed to update note: " + error.message);
        }
      } else {
        // Create Note
        const { error } = await supabase
          .from("note_park")
          .insert({
            class_date: classDate,
            class_time: classTime,
            subject_name: subjectName,
            class_period: classPeriod,
            class_teacher: classTeacher,
            attachments: attachmentsList
          });

        if (!error) {
          setSuccessMsg("New class note published in NotePark!");
          // Clear draft storage
          safeStorage.removeItem("note_park_form_draft");
          resetForm();
          fetchNotes();
        } else {
          setFormError("Failed to publish note: " + error.message);
        }
      }
    } catch (err: any) {
      setFormError("System error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNoteClick = (note: NoteParkItem) => {
    setEditingId(note.id);
    setClassDate(note.class_date);
    setClassTime(note.class_time);
    setSubjectName(note.subject_name);
    setClassPeriod(note.class_period);
    setClassTeacher(note.class_teacher);
    setAttachmentsList(note.attachments || []);
    setFormError("");
    setSuccessMsg("");
  };

  const handleDeleteNoteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this class note?")) return;

    try {
      const { error } = await supabase.from("note_park").delete().eq("id", id);
      if (!error) {
        setSuccessMsg("Note permanently deleted.");
        fetchNotes();
      } else {
        alert("Failed to delete note: " + error.message);
      }
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setClassDate("");
    setClassTime("");
    setSubjectName("");
    setClassPeriod("");
    setClassTeacher("");
    setAttachmentsList([]);
    setAttachmentName("");
    setAttachmentUrl("");
    setFormError("");
  };

  // Filter & Sort notes
  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    
    const matchesSubject = note.subject_name.toLowerCase().includes(q);
    const matchesTeacher = note.class_teacher.toLowerCase().includes(q);
    const matchesPeriod = note.class_period.toLowerCase().includes(q);
    const matchesDate = note.class_date.toLowerCase().includes(q);
    const matchesAttachments = note.attachments && note.attachments.some(att => 
      att.name.toLowerCase().includes(q)
    );

    return matchesSubject || matchesTeacher || matchesPeriod || matchesDate || !!matchesAttachments;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.class_date).getTime() - new Date(a.class_date).getTime();
    } else if (sortBy === "date-asc") {
      return new Date(a.class_date).getTime() - new Date(b.class_date).getTime();
    } else {
      return a.subject_name.localeCompare(b.subject_name);
    }
  });

  return (
    <div id="notepark-view" className="space-y-10 w-full max-w-none px-4">
      {/* Visual Identity Header - Matrix/Cyber grid themed distinct visual style */}
      <div className="relative p-8 rounded-3xl bg-slate-900 border border-teal-500/30 overflow-hidden text-left shadow-xl shadow-teal-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.15),transparent)] pointer-events-none" />
        {/* Cyber blueprint Grid background effect */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#0f766e_1px,transparent_1px),linear-gradient(to_bottom,#0f766e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Dynamic Note Reservoir
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Note<span className="text-teal-400">Park</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-xs font-sans">
              Welcome to the official URP'25 Note Repository. Access class notes, reference matrices, drawing sheets, and study guidelines posted by class representatives.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchNotes}
              disabled={isFetching}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center justify-center"
              title="Refresh Note Database"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-teal-400" : ""}`} />
            </button>

            {isAdmin && (
              <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold uppercase animate-pulse">
                Admin Panel Sync Enabled
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: ADMIN COMPOSER (Only displayed if authenticated as admin) */}
        {isAdmin && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-6 text-left text-white relative">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none rounded-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-400" />
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider">
                    {editingId ? "Edit Class Note" : "Publish Class Note"}
                  </h3>
                </div>
                {!editingId && (
                  <span className="text-[9px] font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 animate-pulse">
                    Auto-Save Active
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmitNote} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-teal-400" /> Class Date
                    </label>
                    <input
                      type="date"
                      required
                      value={classDate}
                      onChange={(e) => setClassDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-400" /> Class Time
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10:30 AM"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-teal-400" /> Subject / Topic Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Transport Planning Studio"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      Class Period
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1st & 2nd"
                      value={classPeriod}
                      onChange={(e) => setClassPeriod(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-teal-400" /> Class Teacher
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sadat Rahman"
                      value={classTeacher}
                      onChange={(e) => setClassTeacher(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                  </div>
                </div>

                {/* ATTACHMENT BUILDER SUB-FORM */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
                    Attach Resource / File
                  </span>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <select
                        value={attachmentType}
                        onChange={(e: any) => setAttachmentType(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                      >
                        <option value="file">📄 PDF/File</option>
                        <option value="photo">🖼️ Photo</option>
                        <option value="link">🔗 Link</option>
                      </select>
                    </div>

                    <div className="col-span-8">
                      <input
                        type="text"
                        placeholder="Attachment Name (e.g. Slide Pack 1)"
                        value={attachmentName}
                        onChange={(e) => setAttachmentName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Resource URL (HTTP or HTTPS)"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  {/* Render attachments lists */}
                  {attachmentsList.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2 max-h-32 overflow-y-auto">
                      {attachmentsList.map((att, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] font-mono text-slate-300">
                          <span className="truncate max-w-[200px] flex items-center gap-1.5">
                            {att.type === "file" && <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                            {att.type === "photo" && <Image className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                            {att.type === "link" && <Link className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                            {att.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(idx)}
                            className="text-red-400 hover:text-red-500 p-0.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formError && (
                  <p className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </p>
                )}

                {successMsg && (
                  <p className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">
                    {successMsg}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold uppercase transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-teal-400 hover:bg-teal-500 disabled:bg-slate-800 text-slate-950 font-black uppercase rounded-lg text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Publishing note..." : editingId ? "Update Class Note" : "Publish to NotePark"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* RIGHT PANEL: NOTES FEED */}
        <div className={isAdmin ? "lg:col-span-7 space-y-6" : "lg:col-span-12 space-y-6"}>
          
          {/* Query, Search and Sorting filters */}
          <div className="bg-white dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-stone-500">
                  <Search className="w-4 h-4 text-teal-500" />
                </span>
                <input
                  type="text"
                  placeholder="Search by title, teacher, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                    title="Clear Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-stone-400 font-mono flex items-center gap-1 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-teal-500" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-bahnschrift font-semibold rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 cursor-pointer"
                >
                  <option value="date-desc">🗓️ Date (Newest)</option>
                  <option value="date-asc">🗓️ Date (Oldest)</option>
                  <option value="subject">📚 Subject Name</option>
                </select>
              </div>
            </div>

            {/* Quick Filters Pill bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-900/40 text-xs">
              <span className="text-stone-400 dark:text-stone-500 font-mono text-[10px] uppercase tracking-wider">Quick Filters:</span>
              <button
                onClick={() => setSearchQuery("")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  !searchQuery 
                    ? "bg-teal-500/10 text-teal-500 border border-teal-500/30 font-bold" 
                    : "bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-teal-500/30"
                }`}
              >
                All Notes
              </button>
              {Array.from(new Set([
                ...notes.map(n => n.subject_name.split(" ")[0]).filter(s => s && s.length > 2),
                ...notes.map(n => {
                  const parts = n.class_teacher.split(" ");
                  return parts[parts.length - 1] || "";
                }).filter(t => t && t.length > 2)
              ])).slice(0, 5).map((filterKeyword) => (
                <button
                  key={filterKeyword}
                  onClick={() => setSearchQuery(filterKeyword)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer capitalize ${
                    searchQuery.toLowerCase() === filterKeyword.toLowerCase()
                      ? "bg-teal-500/10 text-teal-500 border border-teal-500/30 font-bold"
                      : "bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-teal-500/30"
                  }`}
                >
                  {filterKeyword}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Feed */}
          {sortedNotes.length > 0 ? (
            <div className="space-y-4 text-left">
              <AnimatePresence mode="popLayout">
                {sortedNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 sm:p-6 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 hover:border-teal-500/30 dark:hover:border-teal-500/20 rounded-2xl shadow-sm transition-all duration-300 relative group"
                  >
                    {/* Glowing Accent line in cards */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        
                        {/* Class Metadata Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 flex items-center gap-1 font-semibold">
                            <Calendar className="w-3 h-3 text-teal-500" /> {note.class_date}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3 text-teal-500" /> {note.class_time}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-500 font-bold uppercase">
                            Period: {note.class_period}
                          </span>
                        </div>

                        {/* Subject Title */}
                        <div>
                          <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900 dark:text-white uppercase tracking-tight group-hover:text-teal-500 transition-colors">
                            {note.subject_name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                              Taught by: <span className="font-bold">{note.class_teacher}</span>
                            </span>
                          </div>
                        </div>

                        {/* Attachments Section */}
                        {note.attachments && note.attachments.length > 0 && (
                          <div className="pt-3 border-t border-stone-100 dark:border-stone-900/60 mt-2 space-y-2">
                            <span className="text-[9px] font-mono font-bold tracking-widest text-stone-400 dark:text-gray-500 uppercase flex items-center gap-1">
                              <Paperclip className="w-3 h-3 text-teal-400" /> Attached Resources ({note.attachments.length})
                            </span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {note.attachments.map((att, idx) => (
                                <a
                                  href={att.url}
                                  key={idx}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-stone-50 hover:bg-teal-500/5 dark:bg-stone-900/30 dark:hover:bg-teal-950/20 border border-stone-150 dark:border-stone-800/80 hover:border-teal-500/20 transition flex items-center justify-between text-xs font-mono group/att"
                                >
                                  <span className="truncate max-w-[180px] flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
                                    {att.type === "file" && <FileText className="w-3.5 h-3.5 text-teal-500" />}
                                    {att.type === "photo" && <Image className="w-3.5 h-3.5 text-orange-500" />}
                                    {att.type === "link" && <Link className="w-3.5 h-3.5 text-purple-500" />}
                                    {att.name}
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-stone-400 group-hover/att:translate-x-0.5 group-hover/att:-translate-y-0.5 transition-transform" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Admin Controls Block inside Notes Feed Cards */}
                      {isAdmin && (
                        <div className="flex sm:flex-col items-center gap-2 shrink-0 justify-end pt-3 sm:pt-0">
                          <button
                            onClick={() => handleEditNoteClick(note)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-teal-500 hover:text-slate-950 dark:bg-slate-900 text-stone-600 dark:text-stone-300 transition border border-stone-200 dark:border-slate-800 cursor-pointer"
                            title="Edit Note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNoteClick(note.id)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white dark:bg-slate-900 text-red-500 transition border border-stone-200 dark:border-slate-800 cursor-pointer"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-850">
              <FolderOpen className="w-12 h-12 text-stone-300 dark:text-stone-800 mx-auto mb-2 animate-pulse" />
              <p className="text-stone-500 text-xs">No class notes match your search criteria.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
