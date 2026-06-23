import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Image, 
  Trash2, 
  Edit3, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Share2,
  Tag,
  Eye,
  Camera,
  Layers,
  AlertTriangle,
  Award
} from "lucide-react";
import { GalleryItem } from "../types";

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  isAdmin: boolean;
  onDeleteGalleryItem: (id: string) => void;
  onEditGalleryItem: (item: GalleryItem) => void;
}

export default function GalleryView({ 
  galleryItems, 
  isAdmin, 
  onDeleteGalleryItem,
  onEditGalleryItem 
}: GalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | "Academic" | "Extra-curriculum">("All");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    // Generate initial randomized like count
    const initialLikes: Record<string, { count: number; liked: boolean }> = {};
    galleryItems.forEach(item => {
      initialLikes[item.id] = { count: Math.floor(18 + Math.random() * 42), liked: false };
    });
    return initialLikes;
  });

  const handleLike = (id: string) => {
    setLikes(prev => {
      const state = prev[id] || { count: 20, liked: false };
      const nextLiked = !state.liked;
      return {
        ...prev,
        [id]: {
          count: nextLiked ? state.count + 1 : state.count - 1,
          liked: nextLiked
        }
      };
    });
  };

  const sortedItems = [...galleryItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const startEditing = (item: GalleryItem) => {
    setEditingItem(item);
    setEditCaption(item.caption);
    setEditTitle(item.title);
    setErrorMsg("");
  };

  const saveEdit = () => {
    if (!editingItem) return;
    
    // Count words to ensure it doesn't exceed 150 words
    const words = editCaption.trim().split(/\s+/).filter(Boolean);
    if (words.length > 150) {
      setErrorMsg(`Caption exceeds 150 words (currently ${words.length} words). Please shorten it.`);
      return;
    }

    onEditGalleryItem({
      ...editingItem,
      title: editTitle,
      caption: editCaption
    });
    setEditingItem(null);
    setErrorMsg("");
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div id="gallery-view" className="space-y-8 w-full max-w-none px-4">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 text-rose-500">
          <Camera className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-stone-900 dark:text-white uppercase">
          RUET URP'25 Gallery
        </h2>

        {/* Admin Login status indicator banner inside gallery */}
        {isAdmin && (
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono font-bold uppercase rounded-lg max-w-sm mx-auto flex items-center justify-center gap-1.5 animate-pulse">
            <Award className="w-4 h-4" /> Admin Controls Active
          </div>
        )}
      </div>

      {/* Gallery Feed (Facebook-like style) */}
      <div className="grid md:grid-cols-2 gap-8">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => {
            const likeState = likes[item.id] || { count: 32, liked: false };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl overflow-hidden flex flex-col justify-between card-hover"
              >
                {/* Image Section */}
                <div className="relative group overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Tag overlay */}
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[9px] font-mono tracking-widest uppercase font-bold border border-white/10 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> {item.category}
                  </span>

                  {/* Date overlay */}
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[9px] font-mono border border-white/10 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> {item.date}
                  </span>

                  {/* Admin inline hover action block */}
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="p-2 rounded-full bg-white text-gray-800 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                        title="Edit Caption"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteGalleryItem(item.id)}
                        className="p-2 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Facebook like Post Body */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-base text-gray-800 dark:text-white uppercase tracking-tight line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Caption (checked up to 150 words limit) */}
                  <div className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-normal border-l-2 border-rose-500/20 pl-3">
                    <p className="whitespace-pre-line">{item.caption}</p>
                    <div className="text-[10px] font-mono text-gray-400 mt-1.5 flex justify-between">
                      <span>Caption length: {countWords(item.caption)} / 150 words</span>
                    </div>
                  </div>

                  {/* Social Action Bar */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-4 text-xs">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        likeState.liked 
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500 font-bold" 
                          : "text-gray-500 hover:text-rose-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likeState.liked ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{likeState.count} Likes</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 px-3 py-1.5 rounded-lg transition">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comment</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-rose-500 px-3 py-1.5 rounded-lg transition">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-500 text-sm">No pictures match the selected category.</p>
          </div>
        )}
      </div>

      {/* Edit Caption Modal Overlay (Only triggered by admin) */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            >
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white uppercase tracking-tight">
                Edit Gallery Post
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400 block">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
                    <label>Caption (Max 150 words)</label>
                    <span className={countWords(editCaption) > 150 ? "text-red-500" : "text-gray-400"}>
                      {countWords(editCaption)} / 150 words
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-[11px] font-mono font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/40">
                  {errorMsg}
                </p>
              )}

              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-3.5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
