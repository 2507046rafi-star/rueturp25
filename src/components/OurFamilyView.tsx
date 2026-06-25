import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ExternalLink, 
  Search, 
  Phone, 
  Mail, 
  Facebook, 
  Award, 
  Star, 
  X, 
  User, 
  ChevronRight,
  Filter,
  Users
} from "lucide-react";
import { Student, getCacheBustedUrl } from "../types";

interface OurFamilyViewProps {
  students: Student[];
  onViewImage?: (src: string, alt: string) => void;
}

export default function OurFamilyView({ students, onViewImage }: OurFamilyViewProps) {
  const [activeTab, setActiveTab] = useState<"teachers" | "students">("students");
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      return localStorage.getItem("family_search_init") || "";
    } catch {
      return "";
    }
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  React.useEffect(() => {
    try {
      localStorage.removeItem("family_search_init");
    } catch {}
  }, []);
  const [tagFilter, setTagFilter] = useState<string>("All");

  // Find unique tags to populate filter
  const allTags = ["All", ...Array.from(new Set(students.flatMap(s => s.tags || [])))];

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (student.name || "").toLowerCase().includes(query) || 
      (student.roll || "").toLowerCase().includes(query) ||
      (student.bio || "").toLowerCase().includes(query);
    
    const matchesTag = tagFilter === "All" || (student.tags && student.tags.includes(tagFilter));
    return matchesSearch && matchesTag;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    return a.roll.localeCompare(b.roll, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div id="our-family-view" className="space-y-8 w-full max-w-none px-4">
      {/* View Title */}
      <div className="text-center space-y-2">
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-stone-900 dark:text-white uppercase">
          Our Family
        </h2>
      </div>

      {/* SpaceX Style Tab Buttons */}
      <div className="flex justify-center border-b border-gray-200 dark:border-gray-800 pb-px">
        <div className="flex gap-8">
          <a
            href="https://www.urp.ruet.ac.bd/teacher"
            target="_blank"
            rel="noopener noreferrer"
            className="pb-4 px-2 text-sm font-semibold tracking-wider uppercase text-gray-500 hover:text-rose-500 transition border-b-2 border-transparent hover:border-rose-500 inline-flex items-center gap-1.5 cursor-pointer"
          >
            Teachers Directory <ExternalLink className="w-3.5 h-3.5" />
          </a>
          
          <button
            onClick={() => setActiveTab("students")}
            className={`pb-4 px-2 text-sm font-semibold tracking-wider uppercase transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "students" 
                ? "text-rose-500 border-rose-500" 
                : "text-gray-500 border-transparent hover:text-rose-500 hover:border-rose-500"
            }`}
          >
            Students <Users className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeTab === "students" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-850">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name, roll, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-start md:justify-end">
              <span className="text-xs text-gray-400 font-mono flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition cursor-pointer ${
                    tagFilter === tag
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-rose-300"
                  }`}
                >
                  {tag === "CR" ? "⭐ Class Representative" : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Students Grid */}
          {sortedStudents.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedStudents.map((student) => {
                const isCR = student.tags?.includes("CR");
                return (
                  <motion.div
                    key={student.roll}
                    layoutId={`student-card-${student.roll}`}
                    whileHover={{ y: -6, boxShadow: "0 10px 20px -10px rgba(244,63,94,0.15)" }}
                    className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 text-center flex flex-col justify-between relative overflow-hidden card-hover"
                  >
                    {/* CR Star Indicator */}
                    {isCR && (
                      <div className="absolute top-3 right-3 bg-rose-50 dark:bg-rose-950/50 p-1.5 rounded-full border border-rose-100 dark:border-rose-900/50" title="Class Representative">
                        <Star className="w-4 h-4 text-rose-500 fill-rose-500" />
                      </div>
                    )}

                    <div>
                      {/* Top Centered Profile Picture */}
                      <div className="flex justify-center mb-4">
                        <div 
                          onClick={() => student.avatar && onViewImage?.(getCacheBustedUrl(student.avatar), student.name)}
                          className={`w-24 h-24 rounded-full overflow-hidden border-2 border-rose-500/20 shadow-md flex items-center justify-center bg-gray-100 dark:bg-gray-800 shrink-0 ${student.avatar ? "cursor-pointer hover:scale-105 transition-transform duration-300" : ""}`}
                          title={student.avatar ? "Click to view full image" : undefined}
                        >
                          {student.avatar ? (
                            <img
                              src={getCacheBustedUrl(student.avatar)}
                              alt={student.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Name & Roll */}
                      <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white uppercase tracking-tight">
                        {student.name}
                      </h3>
                      <p className="font-mono text-xs text-orange-500 font-semibold mt-0.5">
                        Roll: {student.roll}
                      </p>

                      {/* Display Tags on Roster */}
                      <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                        {student.tags?.map(t => (
                          <span 
                            key={t} 
                            className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                              t === "CR" 
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold" 
                                : "bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Public Data List: Roll, Mobile numbers, Facebook link */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-left space-y-2">
                        {/* Mobile numbers */}
                        <div className="space-y-1">
                          {student.mobiles.map((mobile, idx) => (
                            <a
                              href={`tel:${mobile}`}
                              key={idx}
                              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-rose-500 transition"
                            >
                              <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span className="font-mono">{mobile}</span>
                            </a>
                          ))}
                        </div>
                        
                        {/* Facebook ID */}
                        {student.facebook && (
                          <a
                            href={student.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline transition"
                          >
                            <Facebook className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                            <span className="truncate">View Facebook Profile</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="mt-5 w-full py-2 bg-gray-50 hover:bg-rose-500 hover:text-white dark:bg-gray-800 dark:hover:bg-rose-500 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center gap-1.5 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer"
                    >
                      Full Profile <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-2 animate-pulse" />
              <p className="text-gray-500 text-sm">No students match your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Full Student Profile Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={`student-card-${selectedStudent.roll}`}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              {/* Top cover decoration */}
              <div className="h-28 bg-gradient-to-r from-rose-500 to-orange-500 relative">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/40 border border-white/20 text-white hover:text-gray-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile body content */}
              <div className="px-6 pb-6 pt-0 relative">
                {/* Overlap Avatar */}
                <div className="flex justify-center -mt-14 mb-3">
                  <div 
                    onClick={() => selectedStudent.avatar && onViewImage?.(getCacheBustedUrl(selectedStudent.avatar), selectedStudent.name)}
                    className={`w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 ${selectedStudent.avatar ? "cursor-pointer hover:scale-105 transition-transform duration-300" : ""}`}
                    title={selectedStudent.avatar ? "Click to view full image" : undefined}
                  >
                    {selectedStudent.avatar ? (
                      <img
                        src={getCacheBustedUrl(selectedStudent.avatar)}
                        alt={selectedStudent.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
                    {selectedStudent.name}
                    {selectedStudent.tags?.includes("CR") && (
                      <span className="inline-block text-rose-500" title="Class Representative">
                        <Star className="w-5 h-5 fill-rose-500 inline" />
                      </span>
                    )}
                  </h3>
                  <p className="font-mono text-xs text-orange-500 font-semibold mt-1">
                    RUET URP Batch 2025 • Roll: {selectedStudent.roll}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {selectedStudent.tags?.map(t => (
                      <span
                        key={t}
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                          t === "CR"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{selectedStudent.bio || "No bio available for this student."}"
                  </p>
                </div>

                {/* Extended info panel */}
                <div className="mt-5 space-y-3.5">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    Contact Channels
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Mobile list */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Mobiles</span>
                      {selectedStudent.mobiles.map((mobile, idx) => (
                        <a
                          href={`tel:${mobile}`}
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-rose-50 dark:bg-gray-800/30 dark:hover:bg-rose-950/20 border border-gray-150 dark:border-gray-800/60 transition group font-mono"
                        >
                          <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-gray-700 dark:text-gray-200">{mobile}</span>
                        </a>
                      ))}
                    </div>

                    {/* Email list */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Email Addresses</span>
                      {selectedStudent.emails.map((email, idx) => (
                        <a
                          href={`mailto:${email}`}
                          key={idx}
                          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-orange-50 dark:bg-gray-800/30 dark:hover:bg-orange-950/20 border border-gray-150 dark:border-gray-800/60 transition group truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-gray-700 dark:text-gray-200 truncate">{email}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Social Profile */}
                  {selectedStudent.facebook && (
                    <div className="pt-2">
                      <a
                        href={selectedStudent.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 transition group font-semibold text-blue-700 dark:text-blue-300 text-xs cursor-pointer"
                      >
                        <Facebook className="w-4 h-4 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <span>Connect on Facebook</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Close footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-150 dark:border-gray-800 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
