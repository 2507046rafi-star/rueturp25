export interface Student {
  roll: string;
  name: string;
  mobiles: string[];
  emails: string[];
  facebook: string;
  bio: string;
  avatar: string;
  tags: string[]; // e.g., ["CR", "GIS Lead"]
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  attachments?: { name: string; url: string; type: string }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string; // up to 150 words
  imageUrl: string;
  category: "Academic" | "Extra-curriculum";
  date: string;
}

export interface AdminSettings {
  aboutUs: string; // up to 1000 words
  aboutUsImage: string;
  policy: string;
}

export interface NoteParkItem {
  id: string;
  class_date: string;
  class_time: string;
  subject_name: string;
  class_period: string;
  class_teacher: string;
  attachments?: { name: string; url: string; type: "file" | "photo" | "link" }[];
  created_at?: string;
}

export type ViewType = 
  | "Home" 
  | "Our Family" 
  | "Notice" 
  | "Cloud" 
  | "Academic Tools" 
  | "Gallery" 
  | "NotePark"
  | "Admin Panel";

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // safe fallback
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // safe fallback
    }
  },
  parseItem: <T>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // safe fallback
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // safe fallback
    }
  },
  parseItem: <T>(key: string, fallback: T): T => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }
};
