import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  ShieldCheck, 
  Bell, 
  Users, 
  Camera, 
  Phone, 
  Info, 
  Network, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle,
  AlertTriangle,
  LogOut,
  Save,
  Star
} from "lucide-react";
import { Student, Notice, GalleryItem, AdminSettings } from "../types";

interface AdminPanelViewProps {
  isAuthenticated: boolean;
  onLogin: (pass: string) => boolean;
  onLogout: () => void;
  
  // Notice controls
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  
  // Student controls
  students: Student[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (roll: string) => void;
  onUpdateStudent: (student: Student) => void;

  // Gallery controls
  galleryItems: GalleryItem[];
  onAddGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;

  // Global settings
  adminSettings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;

  // Contact & Social channels
  contactInfo: { email: string; phone: string };
  onUpdateContactInfo: (info: { email: string; phone: string }) => void;
  
  onlinePlatforms: { name: string; url: string }[];
  onUpdateOnlinePlatforms: (platforms: { name: string; url: string }[]) => void;
}

export default function AdminPanelView({
  isAuthenticated,
  onLogin,
  onLogout,
  notices,
  onAddNotice,
  onDeleteNotice,
  students,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudent,
  galleryItems,
  onAddGalleryItem,
  onDeleteGalleryItem,
  adminSettings,
  onUpdateSettings,
  contactInfo,
  onUpdateContactInfo,
  onlinePlatforms,
  onUpdateOnlinePlatforms
}: AdminPanelViewProps) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeEnquiry, setActiveEnquiry] = useState<
    "notice" | "students" | "gallery" | "contact" | "ruet" | "platforms" | "policy"
  >("notice");

  // Local Form States
  // 1. Notice
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeAuthor, setNoticeAuthor] = useState("Sadat Rahman (CR)");
  const [noticeAttachments, setNoticeAttachments] = useState<{ name: string; url: string; type: string }[]>([]);

  // 2. Student
  const [studRoll, setStudRoll] = useState("");
  const [studName, setStudName] = useState("");
  const [studMobiles, setStudMobiles] = useState("");
  const [studEmails, setStudEmails] = useState("");
  const [studFacebook, setStudFacebook] = useState("");
  const [studBio, setStudBio] = useState("");
  const [studAvatar, setStudAvatar] = useState("");
  const [studTags, setStudTags] = useState("");
  const [editingStudentRoll, setEditingStudentRoll] = useState<string | null>(null);

  // 3. Gallery
  const [galTitle, setGalTitle] = useState("");
  const [galCaption, setGalCaption] = useState("");
  const [galCategory, setGalCategory] = useState<"Academic" | "Extra-curriculum">("Academic");
  const [galImageUrl, setGalImageUrl] = useState("");

  // 4. Contact
  const [contEmail, setContEmail] = useState(contactInfo.email);
  const [contPhone, setContPhone] = useState(contactInfo.phone);

  // 5. About RUET URP'25 (Admin Settings)
  const [aboutUsText, setAboutUsText] = useState(adminSettings.aboutUs);
  const [aboutUsImage, setAboutUsImage] = useState(adminSettings.aboutUsImage);

  // 6. Online Platforms
  const [platName, setPlatName] = useState("");
  const [platUrl, setPlatUrl] = useState("");

  // 7. Policy
  const [policyText, setPolicyText] = useState(adminSettings.policy);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passcode);
    if (success) {
      setErrorMsg("");
      setPasscode("");
    } else {
      setErrorMsg("Incorrect passcode. Only developers can modify security rules.");
    }
  };

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Action Handlers
  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    
    onAddNotice({
      id: `notice-${Date.now()}`,
      title: noticeTitle,
      content: noticeContent,
      date: new Date().toISOString().split("T")[0],
      author: noticeAuthor,
      attachments: noticeAttachments
    });

    setNoticeTitle("");
    setNoticeContent("");
    setNoticeAttachments([]);
    triggerToast("Notice published successfully!");
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studRoll.trim() || !studName.trim()) return;

    const mobilesArray = studMobiles.split(",").map(m => m.trim()).filter(Boolean);
    const emailsArray = studEmails.split(",").map(em => em.trim()).filter(Boolean);
    const tagsArray = studTags.split(",").map(t => t.trim()).filter(Boolean);

    const studentData: Student = {
      roll: studRoll,
      name: studName,
      mobiles: mobilesArray.length ? mobilesArray : ["01750-121454"],
      emails: emailsArray.length ? emailsArray : ["sadaturp25@gmail.com"],
      facebook: studFacebook || "https://facebook.com",
      bio: studBio || "Student of RUET URP'25 Batch.",
      avatar: studAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      tags: tagsArray
    };

    if (editingStudentRoll) {
      onUpdateStudent(studentData);
      setEditingStudentRoll(null);
      triggerToast("Student profile updated!");
    } else {
      // Check duplicate roll
      if (students.some(s => s.roll === studRoll)) {
        triggerToast("Student with this roll already exists!", "error");
        return;
      }
      onAddStudent(studentData);
      triggerToast("New student registered successfully!");
    }

    setStudRoll("");
    setStudName("");
    setStudMobiles("");
    setStudEmails("");
    setStudFacebook("");
    setStudBio("");
    setStudAvatar("");
    setStudTags("");
  };

  const handleEditStudentSelect = (student: Student) => {
    setEditingStudentRoll(student.roll);
    setStudRoll(student.roll);
    setStudName(student.name);
    setStudMobiles(student.mobiles.join(", "));
    setStudEmails(student.emails.join(", "));
    setStudFacebook(student.facebook);
    setStudBio(student.bio);
    setStudAvatar(student.avatar);
    setStudTags(student.tags.join(", "));
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !galCaption.trim()) return;

    const words = wordCount(galCaption);
    if (words > 150) {
      triggerToast(`Caption length is ${words} words. The maximum allowed limit is 150 words.`, "error");
      return;
    }

    onAddGalleryItem({
      id: `gallery-${Date.now()}`,
      title: galTitle,
      caption: galCaption,
      category: galCategory,
      imageUrl: galImageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      date: new Date().toISOString().split("T")[0]
    });

    setGalTitle("");
    setGalCaption("");
    setGalImageUrl("");
    triggerToast("Post added to Gallery!");
  };

  const handleUpdateContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContactInfo({ email: contEmail, phone: contPhone });
    triggerToast("Contact info updated!");
  };

  const handleUpdateAboutUsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const words = wordCount(aboutUsText);
    if (words > 1000) {
      triggerToast(`About Us description is ${words} words. Max 1000 words.`, "error");
      return;
    }
    onUpdateSettings({ ...adminSettings, aboutUs: aboutUsText, aboutUsImage: aboutUsImage });
    triggerToast("RUET URP'25 Batch profile updated!");
  };

  const handleAddPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platName.trim() || !platUrl.trim()) return;
    const updated = [...onlinePlatforms, { name: platName, url: platUrl }];
    onUpdateOnlinePlatforms(updated);
    setPlatName("");
    setPlatUrl("");
    triggerToast("Platform community link registered!");
  };

  const handleDeletePlatform = (index: number) => {
    const updated = onlinePlatforms.filter((_, i) => i !== index);
    onUpdateOnlinePlatforms(updated);
  };

  const handleUpdatePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ ...adminSettings, policy: policyText });
    triggerToast("Website Policy updated!");
  };

  // If NOT authenticated, show elegant SpaceX styled Lock screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-xl space-y-6 text-center my-12 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 to-orange-500" />
        
        <div className="inline-flex p-4 bg-rose-50 dark:bg-rose-950/40 rounded-full border border-rose-100 dark:border-rose-900/50 text-rose-500">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white uppercase tracking-tight">
            Administrative Lock
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure clearance required. Enter passcode to authorize modifications to database, notices, and student credentials.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Authorized Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500 text-center text-sm font-mono tracking-widest text-gray-850 dark:text-gray-100"
          />
          {errorMsg && (
            <p className="text-[11px] font-mono font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100 dark:border-red-900/40">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition cursor-pointer shadow-sm"
          >
            Authenticate Terminal
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] font-mono text-gray-400">
          🔒 <span className="font-semibold text-rose-500">Authorized Personnel Only:</span> If you are a batch representative, please use the designated RUET URP passcode.
        </div>
      </div>
    );
  }

  // Dashboard sidebar categories
  const enquirys = [
    { id: "notice", label: "Notice Enquiry", icon: Bell },
    { id: "students", label: "Students Enquiry", icon: Users },
    { id: "gallery", label: "Gallery Enquiry", icon: Camera },
    { id: "contact", label: "Contact Enquiry", icon: Phone },
    { id: "ruet", label: "RUET URP'25 Enquiry", icon: Info },
    { id: "platforms", label: "Online Platforms Enquiry", icon: Network },
    { id: "policy", label: "Website Policy Enquiry", icon: ShieldAlert }
  ];

  return (
    <div id="admin-panel" className="w-full max-w-none px-4 space-y-6">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-200/50 dark:border-gray-800 p-5 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl text-gray-900 dark:text-white uppercase tracking-tight">
              Admin Terminal Active
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              Cleared Authority Level • Database synchronization active
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-white hover:bg-red-500 hover:text-white dark:bg-gray-800 dark:hover:bg-red-500 border border-gray-200 dark:border-gray-700 text-red-500 font-semibold text-xs tracking-wider uppercase rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout Session
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Sidebar categories switcher */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block mb-1">
            Enquiry Modules
          </span>
          {enquirys.map((enq) => {
            const Icon = enq.icon;
            return (
              <button
                key={enq.id}
                onClick={() => setActiveEnquiry(enq.id as any)}
                className={`w-full p-3.5 rounded-xl text-left border text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center gap-3 cursor-pointer ${
                  activeEnquiry === enq.id
                    ? "bg-gradient-to-r from-rose-50 to-orange-50 dark:from-gray-900 dark:to-gray-850 border-rose-300 text-rose-500 dark:text-rose-400 shadow-sm font-bold"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-rose-300"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${activeEnquiry === enq.id ? "text-rose-500" : "text-gray-400"}`} />
                <span>{enq.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel Area */}
        <div className="md:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          
          {/* NOTICE ENQUIRY */}
          {activeEnquiry === "notice" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                  Notice Enquiry
                </h3>
                <p className="text-xs text-gray-400">Post new class announcements or delete deprecated bulletins instantly.</p>
              </div>

              {/* Add notice form */}
              <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Notice Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Studio Class Time Rearrangement"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Author</label>
                    <input
                      type="text"
                      required
                      value={noticeAuthor}
                      onChange={(e) => setNoticeAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Notice Content</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter full notice body details here..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                {/* Attachments Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-gray-400 block">Notice Attachments (Images, PDFs, Documents)</label>
                  <div className="flex flex-col gap-2">
                    <label className="w-full sm:w-auto self-start px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg text-[11px] font-semibold text-stone-700 dark:text-stone-300 transition uppercase cursor-pointer flex items-center justify-center gap-1.5 border border-stone-250 dark:border-stone-750">
                      <Plus className="w-3.5 h-3.5 text-rose-500" /> Choose Files to Attach
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []) as File[];
                          files.forEach((file: File) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") {
                                setNoticeAttachments(prev => [
                                  ...prev,
                                  {
                                    name: file.name,
                                    url: reader.result as string, // base64 data URL
                                    type: file.type || "application/octet-stream"
                                  }
                                ]);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>

                    {/* Attachments preview list */}
                    {noticeAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {noticeAttachments.map((att, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-[11px]">
                            <span className="font-mono text-stone-600 dark:text-stone-400 line-clamp-1 max-w-[150px]">{att.name}</span>
                            <button
                              type="button"
                              onClick={() => setNoticeAttachments(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 cursor-pointer font-bold shrink-0 ml-1"
                              title="Remove attachment"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Publish Notice
                </button>
              </form>

              {/* Notices list and delete option */}
              <div className="space-y-2 pt-4 border-t border-gray-150 dark:border-gray-800">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block mb-2">
                  Existing Bulletins ({notices.length})
                </span>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 flex justify-between items-center gap-4 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-gray-800 dark:text-white uppercase truncate block">
                          {n.title}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {n.date} • By: {n.author}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteNotice(n.id)}
                        className="p-1.5 rounded-md hover:bg-red-500 hover:text-white text-red-500 transition cursor-pointer shrink-0"
                        title="Delete notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS ENQUIRY */}
          {activeEnquiry === "students" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                    Students Enquiry
                  </h3>
                  <p className="text-xs text-gray-400">Register new batch mates or adjust tag authorizations (e.g. CR star badges).</p>
                </div>
                {editingStudentRoll && (
                  <button 
                    onClick={() => {
                      setEditingStudentRoll(null);
                      setStudRoll("");
                      setStudName("");
                      setStudMobiles("");
                      setStudEmails("");
                      setStudFacebook("");
                      setStudBio("");
                      setStudAvatar("");
                      setStudTags("");
                    }}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[10px] rounded font-semibold text-gray-500 uppercase font-mono cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Student Roll *</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingStudentRoll}
                      placeholder="e.g., 2017001"
                      value={studRoll}
                      onChange={(e) => setStudRoll(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50 font-mono"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sadat Rahman Khan"
                      value={studName}
                      onChange={(e) => setStudName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Mobiles (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., 01750-121454, 01823-456789"
                      value={studMobiles}
                      onChange={(e) => setStudMobiles(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Emails (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., sadat@gmail.com, sadat.urp@ruet.ac.bd"
                      value={studEmails}
                      onChange={(e) => setStudEmails(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Facebook URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/sadat.urp25"
                      value={studFacebook}
                      onChange={(e) => setStudFacebook(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Avatar Image (Upload or Paste URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={studAvatar}
                        onChange={(e) => setStudAvatar(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                      <label className="px-3 py-2 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 transition cursor-pointer flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-800">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  setStudAvatar(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Authorization Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., CR, Tech Expert (CR tag renders the star logo)"
                      value={studTags}
                      onChange={(e) => setStudTags(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Student Short Bio</label>
                    <input
                      type="text"
                      placeholder="A short professional planner bio."
                      value={studBio}
                      onChange={(e) => setStudBio(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> 
                  {editingStudentRoll ? "Update Student Profile" : "Register Student"}
                </button>
              </form>

              {/* Existing Roster List and actions */}
              <div className="space-y-2 pt-4 border-t border-gray-150 dark:border-gray-800">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block mb-2">
                  Active Student List ({students.length})
                </span>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {students.map((s) => (
                    <div
                      key={s.roll}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 flex justify-between items-center gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-rose-500/10 shrink-0" />
                        <div>
                          <span className="font-bold text-gray-800 dark:text-white uppercase flex items-center gap-1">
                            {s.name} {s.tags.includes("CR") && <Star className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 block">Roll: {s.roll}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditStudentSelect(s)}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 transition cursor-pointer"
                          title="Edit Student Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(s.roll)}
                          className="p-1.5 rounded hover:bg-red-500 hover:text-white text-red-500 transition cursor-pointer"
                          title="Remove student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY ENQUIRY */}
          {activeEnquiry === "gallery" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                  Gallery Enquiry
                </h3>
                <p className="text-xs text-gray-400">Post new laboratory photographs. Caption must strictly remain within 150 words.</p>
              </div>

              <form onSubmit={handleGallerySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Photo Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., GIS Buffer Zoning Excursion"
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Category Selection</label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Extra-curriculum">Extra-curriculum</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Image Source Link URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={galImageUrl}
                    onChange={(e) => setGalImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
                    <label>Description Caption *</label>
                    <span className={wordCount(galCaption) > 150 ? "text-red-500" : "text-gray-400"}>
                      {wordCount(galCaption)} / 150 words
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide Facebook style description caption (Max 150 words)..."
                    value={galCaption}
                    onChange={(e) => setGalCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Post to Gallery
                </button>
              </form>
            </div>
          )}

          {/* CONTACT ENQUIRY */}
          {activeEnquiry === "contact" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                  Contact Enquiry
                </h3>
                <p className="text-xs text-gray-400">Configure central mobile contacts and email channels displayed on footer margins.</p>
              </div>

              <form onSubmit={handleUpdateContactSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Batch Official Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contEmail}
                    onChange={(e) => setContEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Official Mobile Hotline</label>
                  <input
                    type="text"
                    required
                    value={contPhone}
                    onChange={(e) => setContPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Contact Details
                </button>
              </form>
            </div>
          )}

          {/* RUET URP'25 ENQUIRY */}
          {activeEnquiry === "ruet" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                  RUET URP'25 Enquiry
                </h3>
                <p className="text-xs text-gray-400">Upload batch description. The text is limited to 1000 words according to specifications.</p>
              </div>

              <form onSubmit={handleUpdateAboutUsSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Department / Batch Illustration Photo URL</label>
                  <input
                    type="url"
                    value={aboutUsImage}
                    onChange={(e) => setAboutUsImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
                    <label>About Batch Description Text (Max 1000 words)</label>
                    <span className={wordCount(aboutUsText) > 1000 ? "text-red-500" : "text-gray-400"}>
                      {wordCount(aboutUsText)} / 1000 words
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    value={aboutUsText}
                    onChange={(e) => setAboutUsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed font-light text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Sync About Details
                </button>
              </form>
            </div>
          )}

          {/* ONLINE PLATFORMS ENQUIRY */}
          {activeEnquiry === "platforms" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                  Online Platforms Enquiry
                </h3>
                <p className="text-xs text-gray-400">Manage social community links (Facebook, WhatsApp, Telegram groups).</p>
              </div>

              {/* Add community link */}
              <form onSubmit={handleAddPlatform} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Platform Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., RUET URP'25 Official FB Group"
                      value={platName}
                      onChange={(e) => setPlatName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Group / Invitation Link URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://facebook.com/groups/..."
                      value={platUrl}
                      onChange={(e) => setPlatUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Register Group
                </button>
              </form>

              {/* Platforms list */}
              <div className="space-y-2 pt-4 border-t border-gray-150 dark:border-gray-800">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block mb-2">
                  Registered Communities ({onlinePlatforms.length})
                </span>
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                  {onlinePlatforms.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 flex justify-between items-center gap-4 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-gray-800 dark:text-white uppercase truncate block">
                          {p.name}
                        </span>
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-rose-500 truncate block">
                          {p.url}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDeletePlatform(idx)}
                        className="p-1.5 rounded-md hover:bg-red-500 hover:text-white text-red-500 transition cursor-pointer shrink-0"
                        title="Delete group link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WEBSITE POLICY ENQUIRY */}
          {activeEnquiry === "policy" && (
            <div className="space-y-6">
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white uppercase">
                  Website Policy Enquiry
                </h3>
                <p className="text-xs text-gray-400">Edit website privacy guidelines, code of conduct, and database access controls.</p>
              </div>

              <form onSubmit={handleUpdatePolicySubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Policy Guidelines Text (Plaintext or Markdown)</label>
                  <textarea
                    rows={10}
                    required
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-light leading-relaxed text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Policy Settings
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Elegant Floating Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-md max-w-sm font-mono text-xs ${
              toast.type === "error"
                ? "bg-red-500/95 dark:bg-red-950/90 text-white border-red-500/30"
                : "bg-stone-900/95 dark:bg-stone-950/90 text-white border-stone-800"
            }`}
          >
            <span>{toast.type === "error" ? "🚨" : "✨"}</span>
            <span className="font-semibold tracking-tight leading-relaxed">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
