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
  publish_date?: string;
  publish_time?: string;
  is_latest?: boolean;
}

export interface InsiderTopic {
  id: string;
  title: string;
  short: string;
  content: string;
  icon: string; // e.g., "Map", "Layers", "Compass", "Camera", "Lightbulb", "Users", "Megaphone", "Globe"
  bg: string;   // e.g., "from-blue-600/20 to-indigo-600/20 border-blue-500/30"
  attachments?: { name: string; url: string; type: string }[];
}

export interface AdminSettings {
  aboutUs: string; // up to 1000 words
  aboutUsImage: string;
  policy: string;
  isNoticesEnabled?: boolean;
  isFamilyEnabled?: boolean;
  isAcademicsEnabled?: boolean;
  isCloudEnabled?: boolean;
  isGalleryEnabled?: boolean;
  galleryUrl?: string;
  cloudDriveUrl?: string;
  academicDriveUrl?: string;
}

export type ViewType = 
  | "Home" 
  | "Our Family" 
  | "Notice" 
  | "Cloud" 
  | "Academic Tools" 
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

// Global page-load timestamp used for cache-busting student avatars and images
export const PAGE_LOAD_TIMESTAMP = Date.now();

export function getCacheBustedUrl(url: string | undefined): string {
  if (!url) return "";
  return url;
}

