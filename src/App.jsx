import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET = "the-collection-images";

const ERAS = ["All", "Civil War", "World War I", "World War II", "Vietnam War", "Other"];
const CATEGORIES = ["All", "Uniforms", "Medals & Badges", "Weapons", "Documents", "Equipment", "Photographs", "Maps", "Insignia", "Other"];

// Era configuration with placeholder images and descriptions
const ERA_CONFIG = {
  "All": {
    image: "https://images.unsplash.com/photo-1447703693928-9cddb87d9d78?w=800&q=80",
    label: "Full Collection",
    years: "1860 – Present",
    description: "Browse the complete archive of artifacts spanning American military history",
    accent: "#8b7355",
  },
  "Civil War": {
    image: "https://images.unsplash.com/photo-1580130775562-0ef92da028de?w=800&q=80",
    label: "Civil War",
    years: "1861 – 1865",
    description: "Artifacts from the War Between the States — uniforms, arms, and personal effects",
    accent: "#6b4c35",
  },
  "World War I": {
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80",
    label: "World War I",
    years: "1914 – 1918",
    description: "The Great War — helmets, medals, trench art, and documents from the Western Front",
    accent: "#4a5c3a",
  },
  "World War II": {
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&q=80",
    label: "World War II",
    years: "1939 – 1945",
    description: "The Second World War — Allied and Axis memorabilia from every theater of operation",
    accent: "#3a4a5c",
  },
  "Vietnam War": {
    image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=80",
    label: "Vietnam War",
    years: "1955 – 1975",
    description: "Artifacts from the Vietnam era — patches, field gear, and personal memorabilia",
    accent: "#5c4a3a",
  },
  "Other": {
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80",
    label: "Other Conflicts",
    years: "Various",
    description: "Additional military artifacts from conflicts and periods across American history",
    accent: "#4a3a5c",
  },
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1580130775562-0ef92da028de?w=1600&q=80",
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1600&q=80",
  "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1600&q=80",
  "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1600&q=80",
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { -webkit-font-smoothing: antialiased; }
  body { font-family: 'Raleway', sans-serif; background: #f0ece4; color: #2c2318; min-height: 100vh; }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2.5rem;
    border-bottom: 1px solid rgba(44,35,24,0.1);
    transition: background 0.4s;
  }
  nav.nav-dark { background: rgba(20,14,8,0.72); backdrop-filter: blur(6px); border-bottom: 1px solid rgba(255,255,255,0.08); }
  nav.nav-light { background: #f0ece4; }
  .nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: #2c2318; cursor: pointer; line-height: 1; letter-spacing: -0.01em; }
  nav.nav-dark .nav-brand { color: #f0ece4; }
  .nav-brand-sub { font-family: 'Raleway', sans-serif; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase; color: #8b7355; display: block; margin-top: 2px; }
  .nav-actions { display: flex; align-items: center; gap: 1rem; }
  .btn-nav { font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; padding: 0.5rem 1.2rem; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
  .btn-nav-outline { background: transparent; border: 1px solid rgba(44,35,24,0.3); color: #2c2318; }
  nav.nav-dark .btn-nav-outline { border-color: rgba(240,236,228,0.3); color: #f0ece4; }
  .btn-nav-outline:hover { background: #2c2318; color: #f0ece4; border-color: #2c2318; }
  nav.nav-dark .btn-nav-outline:hover { background: #f0ece4; color: #2c2318; }
  .btn-nav-solid { background: #8b7355; border: 1px solid #8b7355; color: #fff; }
  .btn-nav-solid:hover { background: #6b5a42; border-color: #6b5a42; }

  /* ── LANDING / HERO ── */
  .hero { position: relative; height: 100vh; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; }
  .hero-img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transition: opacity 1.2s ease; filter: brightness(0.45) sepia(0.3);
  }
  .hero-img.active { opacity: 1; }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(20,14,8,0.3) 0%, rgba(20,14,8,0.1) 40%, rgba(20,14,8,0.7) 100%);
  }
  .hero-content {
    position: relative; z-index: 2; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
  }
  .hero-eyebrow {
    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.35em; text-transform: uppercase; color: #c9a96e;
    margin-bottom: 1.5rem; opacity: 0; animation: fadeUp 0.8s 0.3s forwards;
  }
  .hero-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(3.5rem, 8vw, 7rem);
    font-weight: 300; color: #f0ece4; line-height: 1.0; letter-spacing: -0.02em;
    margin-bottom: 1.5rem; opacity: 0; animation: fadeUp 0.8s 0.5s forwards;
  }
  .hero-title em { font-style: italic; color: #c9a96e; }
  .hero-divider {
    width: 60px; height: 1px; background: #c9a96e;
    margin: 0 auto 1.5rem; opacity: 0; animation: fadeUp 0.8s 0.7s forwards;
  }
  .hero-subtitle {
    font-family: 'Raleway', sans-serif; font-size: 0.85rem; font-weight: 300;
    letter-spacing: 0.1em; color: rgba(240,236,228,0.7); max-width: 480px; line-height: 1.8;
    margin-bottom: 3rem; opacity: 0; animation: fadeUp 0.8s 0.9s forwards;
  }
  .hero-cta {
    opacity: 0; animation: fadeUp 0.8s 1.1s forwards;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .btn-enter {
    font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase;
    padding: 1rem 3rem; background: transparent;
    border: 1px solid rgba(201,169,110,0.7); color: #c9a96e;
    cursor: pointer; transition: all 0.3s;
  }
  .btn-enter:hover { background: #c9a96e; color: #1a1008; border-color: #c9a96e; }
  .hero-scroll-hint {
    font-family: 'Raleway', sans-serif; font-size: 0.6rem; font-weight: 400;
    letter-spacing: 0.25em; text-transform: uppercase; color: rgba(240,236,228,0.4);
  }
  .hero-dots {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; gap: 0.5rem; z-index: 3;
  }
  .hero-dot { width: 24px; height: 2px; background: rgba(240,236,228,0.3); cursor: pointer; transition: all 0.3s; }
  .hero-dot.active { background: #c9a96e; width: 40px; }

  /* ── ERA SELECTION ── */
  .era-page { min-height: 100vh; background: #1a1008; padding-top: 80px; }
  .era-page-header { text-align: center; padding: 4rem 2rem 3rem; }
  .era-page-eyebrow {
    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.35em; text-transform: uppercase; color: #c9a96e; margin-bottom: 1rem;
  }
  .era-page-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 300; color: #f0ece4; line-height: 1.1; margin-bottom: 1rem;
  }
  .era-page-title em { font-style: italic; color: #c9a96e; }
  .era-page-subtitle {
    font-family: 'Raleway', sans-serif; font-size: 0.8rem; font-weight: 300;
    letter-spacing: 0.1em; color: rgba(240,236,228,0.5); max-width: 400px; margin: 0 auto;
  }

  .era-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2px 4rem;
  }
  @media (max-width: 900px) { .era-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .era-grid { grid-template-columns: 1fr; } }

  .era-tile {
    position: relative; overflow: hidden; cursor: pointer;
    aspect-ratio: 4/3;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 2rem 1.75rem;
    background: #1a1008;
  }
  .era-tile-img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.35) sepia(0.4);
    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s;
  }
  .era-tile:hover .era-tile-img { transform: scale(1.06); filter: brightness(0.25) sepia(0.3); }
  .era-tile-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(20,14,8,0.92) 0%, rgba(20,14,8,0.2) 60%, transparent 100%);
    transition: opacity 0.4s;
  }
  .era-tile:hover .era-tile-overlay { opacity: 1.3; }
  .era-tile-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    opacity: 0; transition: opacity 0.4s;
  }
  .era-tile:hover .era-tile-accent { opacity: 1; }
  .era-tile-content { position: relative; z-index: 2; }
  .era-tile-years {
    font-family: 'Raleway', sans-serif; font-size: 0.6rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #c9a96e;
    margin-bottom: 0.4rem;
  }
  .era-tile-name {
    font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600;
    color: #f0ece4; line-height: 1.1; margin-bottom: 0.75rem;
  }
  .era-tile-desc {
    font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 300;
    letter-spacing: 0.04em; color: rgba(240,236,228,0.6); line-height: 1.6;
    max-width: 260px;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease, opacity 0.4s ease;
  }
  .era-tile:hover .era-tile-desc { max-height: 80px; opacity: 1; }
  .era-tile-arrow {
    position: absolute; right: 1.75rem; bottom: 2rem; z-index: 2;
    width: 32px; height: 32px; border: 1px solid rgba(201,169,110,0.4);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: #c9a96e; font-size: 0.75rem;
    transform: translateX(-8px); opacity: 0;
    transition: transform 0.35s ease, opacity 0.35s ease, background 0.2s;
  }
  .era-tile:hover .era-tile-arrow { transform: translateX(0); opacity: 1; }
  .era-tile-arrow:hover { background: #c9a96e; color: #1a1008; }

  /* ── GALLERY PAGE ── */
  .gallery-page { min-height: 100vh; background: #f0ece4; padding-top: 80px; }
  .gallery-header {
    background: #1a1008; padding: 3rem 2.5rem 2rem;
    display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
  }
  .gallery-header-back {
    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,236,228,0.5);
    background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
    transition: color 0.2s; padding: 0;
  }
  .gallery-header-back:hover { color: #c9a96e; }
  .gallery-header-divider { width: 1px; height: 32px; background: rgba(240,236,228,0.15); }
  .gallery-header-title {
    font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; font-style: italic;
    color: #f0ece4; flex: 1;
  }
  .gallery-header-count {
    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,236,228,0.4);
  }

  .filters-bar {
    padding: 1.25rem 2.5rem; background: #f0ece4;
    border-bottom: 1px solid rgba(44,35,24,0.08);
    display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  }
  .filter-label {
    font-family: 'Raleway', sans-serif; font-size: 0.6rem; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase; color: #8b7355; margin-right: 0.5rem;
  }
  .filter-btn {
    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.1em; padding: 0.4rem 0.9rem;
    border: 1px solid rgba(44,35,24,0.2); border-radius: 2px;
    background: transparent; color: #8b7355; cursor: pointer; transition: all 0.2s;
  }
  .filter-btn:hover, .filter-btn.active { background: #6b7c4a; border-color: #6b7c4a; color: #fff; }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem; padding: 2rem 2.5rem;
    max-width: 1400px; margin: 0 auto;
  }
  .item-card {
    background: #fff; border-radius: 2px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(44,35,24,0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
  }
  .item-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(44,35,24,0.14); }
  .item-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #e8e0d4; }
  .item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .item-card:hover .item-img { transform: scale(1.04); }
  .no-img {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.5rem;
    color: #b0a090; font-family: 'Raleway', sans-serif; font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .no-img-icon { font-size: 2rem; opacity: 0.4; }
  .item-era-badge {
    position: absolute; top: 0.75rem; left: 0.75rem;
    font-family: 'Raleway', sans-serif; font-size: 0.55rem; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.25rem 0.6rem; background: rgba(20,14,8,0.75); color: #c9a96e;
    border-radius: 2px;
  }
  .item-admin-btns {
    position: absolute; top: 0.6rem; right: 0.6rem;
    display: flex; gap: 0.35rem; opacity: 0; transition: opacity 0.2s;
  }
  .item-card:hover .item-admin-btns { opacity: 1; }
  .admin-btn {
    width: 28px; height: 28px; border-radius: 50%;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; transition: transform 0.15s;
  }
  .admin-btn:hover { transform: scale(1.15); }
  .admin-btn-edit { background: #8b7355; color: #fff; }
  .admin-btn-del { background: #c0392b; color: #fff; }
  .item-body { padding: 1.1rem 1.25rem; }
  .item-title {
    font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 600;
    color: #2c2318; margin-bottom: 0.3rem; line-height: 1.3;
  }
  .item-meta {
    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase; color: #8b7355; margin-bottom: 0.6rem;
  }
  .item-desc {
    font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 300;
    line-height: 1.65; color: #5a4a3a;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Empty state */
  .empty-state {
    text-align: center; padding: 6rem 2rem;
    font-family: 'Cormorant Garamond', serif; color: #8b7355;
  }
  .empty-state h3 { font-size: 1.8rem; font-weight: 300; font-style: italic; margin-bottom: 0.75rem; }
  .empty-state p { font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 300; letter-spacing: 0.08em; opacity: 0.7; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(20,14,8,0.8); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: #f0ece4; width: 100%; max-width: 560px; max-height: 90vh;
    overflow-y: auto; border-radius: 2px;
    box-shadow: 0 24px 64px rgba(20,14,8,0.4);
  }
  .modal-header {
    padding: 1.75rem 2rem 1.25rem;
    border-bottom: 1px solid rgba(44,35,24,0.1);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: #2c2318; }
  .modal-close { background: none; border: none; font-size: 1.2rem; color: #8b7355; cursor: pointer; }
  .modal-body { padding: 1.5rem 2rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-label { font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #8b7355; }
  .form-input, .form-select, .form-textarea {
    font-family: 'Raleway', sans-serif; font-size: 0.8rem; font-weight: 400;
    padding: 0.65rem 0.9rem; border: 1px solid rgba(44,35,24,0.2); border-radius: 2px;
    background: #fff; color: #2c2318; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #8b7355; }
  .form-textarea { resize: vertical; min-height: 90px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .upload-zone {
    border: 2px dashed rgba(44,35,24,0.2); border-radius: 2px; padding: 1.5rem;
    text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.5);
  }
  .upload-zone:hover { border-color: #8b7355; background: rgba(139,115,85,0.05); }
  .upload-zone-text { font-family: 'Raleway', sans-serif; font-size: 0.7rem; color: #8b7355; letter-spacing: 0.08em; }
  .upload-preview { width: 100%; max-height: 160px; object-fit: cover; border-radius: 2px; margin-top: 0.75rem; }
  .btn-submit {
    font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.85rem 2rem; background: #8b7355; border: none; color: #fff;
    border-radius: 2px; cursor: pointer; transition: background 0.2s; align-self: flex-end;
  }
  .btn-submit:hover { background: #6b5a42; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .auth-error { font-family: 'Raleway', sans-serif; font-size: 0.72rem; color: #c0392b; padding: 0.5rem 0.75rem; background: rgba(192,57,43,0.08); border-radius: 2px; }

  /* ── LIGHTBOX ── */
  .lightbox-overlay {
    position: fixed; inset: 0; background: rgba(10,6,2,0.95); z-index: 300;
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
  }
  .lightbox-img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 2px; }
  .lightbox-close {
    position: absolute; top: 1.25rem; right: 1.5rem;
    background: none; border: none; color: rgba(240,236,228,0.6); font-size: 1.5rem; cursor: pointer;
  }
  .lightbox-close:hover { color: #f0ece4; }
  .lightbox-caption {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    text-align: center;
    font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic;
    color: rgba(240,236,228,0.7);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function App() {
  // page: "landing" | "eras" | "gallery"
  const [page, setPage] = useState("landing");
  const [selectedEra, setSelectedEra] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [heroIdx, setHeroIdx] = useState(0);
  const [user, setUser] = useState(null);

  // Admin modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", era: "Civil War", category: "Other", description: "", year: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  // Lightbox
  const [lightbox, setLightbox] = useState(null);

  const fileInputRef = useRef();

  // Hero rotation
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load items when gallery page opens
  useEffect(() => {
    if (page === "gallery") fetchItems();
  }, [page]);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from("collection_items").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  // Filtered items
  const filtered = items.filter(item => {
    const eraMatch = selectedEra === "All" || item.era === selectedEra;
    const catMatch = categoryFilter === "All" || item.category === categoryFilter;
    return eraMatch && catMatch;
  });

  // Navigate to era
  function enterEra(era) {
    setSelectedEra(era);
    setCategoryFilter("All");
    setPage("gallery");
  }

  // Auth
  async function handleSignIn() {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
    if (error) { setAuthError(error.message); return; }
    setShowAuthModal(false);
    setAuthForm({ email: "", password: "" });
  }
  async function handleSignOut() { await supabase.auth.signOut(); }

  // Item form
  function openAdd() {
    setEditItem(null);
    setForm({ title: "", era: selectedEra === "All" ? "Civil War" : selectedEra, category: "Other", description: "", year: "" });
    setImageFile(null); setImagePreview(null);
    setShowItemModal(true);
  }
  function openEdit(item) {
    setEditItem(item);
    setForm({ title: item.title, era: item.era, category: item.category, description: item.description || "", year: item.year || "" });
    setImageFile(null); setImagePreview(item.image_url || null);
    setShowItemModal(true);
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      let image_url = editItem?.image_url || null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const filename = `${Date.now()}.${ext}`;
        const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(filename, imageFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
        image_url = publicUrl;
      }
      const payload = { ...form, image_url };
      const { error } = editItem
        ? await supabaseAdmin.from("collection_items").update(payload).eq("id", editItem.id)
        : await supabaseAdmin.from("collection_items").insert([payload]);
      if (error) throw error;
      setShowItemModal(false);
      fetchItems();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this item from the archive?")) return;
    await supabaseAdmin.from("collection_items").delete().eq("id", id);
    fetchItems();
  }

  const navDark = page === "landing" || page === "eras";

  return (
    <>
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className={navDark ? "nav-dark" : "nav-light"}>
        <div className="nav-brand" onClick={() => setPage("landing")}>
          The Collector's Archive
          <span className="nav-brand-sub">Military Antiques Museum</span>
        </div>
        <div className="nav-actions">
          {page !== "landing" && (
            <button className="btn-nav btn-nav-outline" onClick={() => setPage("eras")}>
              Browse by Era
            </button>
          )}
          {user ? (
            <>
              <button className="btn-nav btn-nav-solid" onClick={openAdd}>+ Add Item</button>
              <button className="btn-nav btn-nav-outline" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button className="btn-nav btn-nav-outline" onClick={() => setShowAuthModal(true)}>Curator Login</button>
          )}
        </div>
      </nav>

      {/* ── LANDING ── */}
      {page === "landing" && (
        <div className="hero">
          <div className="hero-bg">
            {HERO_IMAGES.map((src, i) => (
              <img key={i} src={src} className={`hero-img${i === heroIdx ? " active" : ""}`} alt="" />
            ))}
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <div className="hero-eyebrow">A Private Military Museum</div>
            <h1 className="hero-title">The <em>Collector's</em><br />Archive</h1>
            <div className="hero-divider" />
            <p className="hero-subtitle">
              A curated collection of artifacts, documents, and memorabilia honoring those who answered the call — spanning over 160 years of American military history.
            </p>
            <div className="hero-cta">
              <button className="btn-enter" onClick={() => setPage("eras")}>Enter the Archive</button>
              <span className="hero-scroll-hint">Select an era to begin</span>
            </div>
          </div>
          <div className="hero-dots">
            {HERO_IMAGES.map((_, i) => (
              <div key={i} className={`hero-dot${i === heroIdx ? " active" : ""}`} onClick={() => setHeroIdx(i)} />
            ))}
          </div>
        </div>
      )}

      {/* ── ERA SELECTION ── */}
      {page === "eras" && (
        <div className="era-page">
          <div className="era-page-header">
            <div className="era-page-eyebrow">The Collection</div>
            <h2 className="era-page-title">Select an <em>Era</em></h2>
            <p className="era-page-subtitle">Choose a period of history to explore the artifacts within</p>
          </div>
          <div className="era-grid">
            {ERAS.map(era => {
              const cfg = ERA_CONFIG[era];
              return (
                <div key={era} className="era-tile" onClick={() => enterEra(era)}>
                  <img src={cfg.image} alt={era} className="era-tile-img" />
                  <div className="era-tile-overlay" />
                  <div
                    className="era-tile-accent"
                    style={{ background: `linear-gradient(90deg, ${cfg.accent}, transparent)` }}
                  />
                  <div className="era-tile-content">
                    <div className="era-tile-years">{cfg.years}</div>
                    <div className="era-tile-name">{cfg.label}</div>
                    <div className="era-tile-desc">{cfg.description}</div>
                  </div>
                  <div className="era-tile-arrow">→</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── GALLERY ── */}
      {page === "gallery" && (
        <div className="gallery-page">
          <div className="gallery-header">
            <button className="gallery-header-back" onClick={() => setPage("eras")}>
              ← Back to Eras
            </button>
            <div className="gallery-header-divider" />
            <div className="gallery-header-title">
              {selectedEra === "All" ? "Full Collection" : selectedEra}
            </div>
            <div className="gallery-header-count">{filtered.length} artifact{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          <div className="filters-bar">
            <span className="filter-label">Category:</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-btn${categoryFilter === cat ? " active" : ""}`}
                onClick={() => setCategoryFilter(cat)}
              >{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state"><h3>Loading the archive…</h3></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No artifacts found</h3>
              <p>No items match these filters yet</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map(item => (
                <div key={item.id} className="item-card" onClick={() => item.image_url && setLightbox(item)}>
                  <div className="item-img-wrap">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} className="item-img" />
                      : <div className="no-img"><span className="no-img-icon">🎖</span><span>No Photo</span></div>
                    }
                    <div className="item-era-badge">{item.era}</div>
                    {user && (
                      <div className="item-admin-btns" onClick={e => e.stopPropagation()}>
                        <button className="admin-btn admin-btn-edit" onClick={() => openEdit(item)}>✎</button>
                        <button className="admin-btn admin-btn-del" onClick={() => handleDelete(item.id)}>✕</button>
                      </div>
                    )}
                  </div>
                  <div className="item-body">
                    <div className="item-title">{item.title}</div>
                    <div className="item-meta">{item.category}{item.year ? ` · ${item.year}` : ""}</div>
                    {item.description && <div className="item-desc">{item.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close">✕</button>
          <img src={lightbox.image_url} alt={lightbox.title} className="lightbox-img" onClick={e => e.stopPropagation()} />
          <div className="lightbox-caption">{lightbox.title}{lightbox.year ? `, ${lightbox.year}` : ""}</div>
        </div>
      )}

      {/* ── AUTH MODAL ── */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Curator Sign In</div>
              <button className="modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {authError && <div className="auth-error">{authError}</div>}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={authForm.email}
                  onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={authForm.password}
                  onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleSignIn()} />
              </div>
              <button className="btn-submit" onClick={handleSignIn}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT ITEM MODAL ── */}
      {showItemModal && (
        <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editItem ? "Edit Item" : "Add to Archive"}</div>
              <button className="modal-close" onClick={() => setShowItemModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. M1 Garand Rifle" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Era</label>
                  <select className="form-select" value={form.era} onChange={e => setForm(f => ({ ...f, era: e.target.value }))}>
                    {ERAS.filter(e => e !== "All").map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Year / Date</label>
                <input className="form-input" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g. 1943" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Provenance, condition, history…" />
              </div>
              <div className="form-group">
                <label className="form-label">Photo</label>
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  {imagePreview
                    ? <img src={imagePreview} className="upload-preview" alt="Preview" />
                    : <div className="upload-zone-text">Click to upload a photo</div>
                  }
                </div>
              </div>
              <button className="btn-submit" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editItem ? "Save Changes" : "Add to Archive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://feazglrunmdmgugdhhnh.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET = "the-collection-images";

const ERAS = ["All","Civil War","World War I","World War II","Vietnam War","Other"];
const CATEGORIES = ["All","Uniforms","Medals & Badges","Weapons","Documents","Equipment","Photographs","Maps","Insignia","Other"];

const HERO_IMAGES = [
  "https://feazglrunmdmgugdhhnh.supabase.co/storage/v1/object/public/the-collection-images/IMG_6742.jpeg",
  "https://feazglrunmdmgugdhhnh.supabase.co/storage/v1/object/public/the-collection-images/IMG_6752.jpeg",
  "https://feazglrunmdmgugdhhnh.supabase.co/storage/v1/object/public/the-collection-images/IMG_6745%20(1).jpeg",
  "https://feazglrunmdmgugdhhnh.supabase.co/storage/v1/object/public/the-collection-images/IMG_6755%20(1).jpeg",
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body { font-family: 'Raleway', sans-serif; background: #f0ece4; color: #2c2318; min-height: 100vh; }
  .app { min-height: 100vh; }

  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1rem 2.5rem; border-bottom: 1px solid rgba(44,35,24,0.1); }
  nav.nav-dark { background: rgba(20,14,8,0.72); backdrop-filter: blur(6px); border-bottom: 1px solid rgba(255,255,255,0.08); }
  nav.nav-light { background: #f0ece4; }
  .nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: #2c2318; cursor: pointer; line-height: 1; letter-spacing: -0.01em; }
  .nav-brand-sub { font-family: 'Raleway', sans-serif; font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase; color: #9a8868; font-weight: 400; margin-top: 4px; }
  nav.nav-dark .nav-brand { color: #e8dcc8; }
  nav.nav-dark .nav-brand-sub { color: rgba(200,184,154,0.7); }
  .nav-links { display: flex; gap: 2rem; align-items: center; }
  .nav-links button { background: none; border: none; cursor: pointer; font-family: 'Raleway', sans-serif; font-size: 0.78rem; font-weight: 600; color: #2c2318; transition: color 0.2s; }
  .nav-links button:hover { color: #4a6741; }
  nav.nav-dark .nav-links button { color: #c8b89a; }
  nav.nav-dark .nav-links button:hover { color: #e8dcc8; }
  .nav-links .muted-btn { color: #6b5c48; font-weight: 400; }

  .landing { position: relative; height: 100vh; overflow: hidden; }
  .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;object-position: center top; filter: sepia(60%) brightness(0.55) contrast(1.1); transition: opacity 1.2s ease; }
  .hero-img.fade-out { opacity: 0; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,6,2,0.3) 0%, rgba(10,6,2,0.15) 40%, rgba(10,6,2,0.7) 100%); }
  .hero-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
  .hero-eyebrow { font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(200,184,154,0.8); margin-bottom: 1.5rem; font-weight: 400; }
  .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(3.5rem, 8vw, 6.5rem); font-weight: 300; color: #f0e8d8; line-height: 1.05; margin-bottom: 1.25rem; }
  .hero-tagline { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.25rem; color: rgba(220,205,180,0.85); margin-bottom: 3rem; }
  .enter-btn { border: 1px solid rgba(220,205,180,0.6); background: transparent; color: #e8dcc8; font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; padding: 1rem 2.5rem; cursor: pointer; transition: all 0.3s; }
  .enter-btn:hover { background: rgba(220,205,180,0.12); border-color: rgba(220,205,180,0.9); }
  .hero-dots { position: absolute; bottom: 3.5rem; left: 0; right: 0; display: flex; justify-content: center; gap: 8px; }
  .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(220,205,180,0.3); cursor: pointer; transition: background 0.3s; }
  .hero-dot.active { background: rgba(220,205,180,0.85); }
  .hero-footer { position: absolute; bottom: 2rem; left: 0; right: 0; text-align: center; font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(200,184,154,0.5); }

  .gallery-page { padding-top: 72px; min-height: 100vh; }
  .gallery-header { padding: 2rem 2.5rem 1.25rem; border-bottom: 1px solid rgba(44,35,24,0.12); }
  .gallery-desc { font-size: 0.85rem; color: #6b5c48; max-width: 640px; line-height: 1.7; }
  .filters { padding: 1.5rem 2.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-bottom: 1px solid rgba(44,35,24,0.08); }
  .filter-col { display: flex; flex-direction: column; gap: 0.6rem; }
  .filter-row { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
  .filter-label { font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8a7660; font-weight: 500; }
  .filter-btn { background: none; border: 1px solid rgba(44,35,24,0.25); padding: 0.3rem 0.85rem; cursor: pointer; font-family: 'Raleway', sans-serif; font-size: 0.72rem; font-weight: 400; color: #6b5c48; transition: all 0.2s; border-radius: 3px; }
  .filter-btn:hover { border-color: rgba(44,35,24,0.45); color: #2c2318; }
  .filter-btn.active { background: #4a6741; color: #f0e8d8; border-color: #4a6741; }
  .item-count { padding: 1rem 2.5rem 0.5rem; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #8a7660; }
  .grid { padding: 1.25rem 2.5rem 4rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  .card { background: #e8e0d0; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(44,35,24,0.08); }
  .card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(44,35,24,0.12); }
  .card-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; filter: sepia(20%) brightness(0.95); display: block; }
  .card-no-img { width: 100%; aspect-ratio: 4/3; background: #d4cabb; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #8a7660; }
  .card-body { padding: 1rem 1.1rem 1.25rem; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 500; color: #2c2318; margin-bottom: 0.35rem; line-height: 1.3; }
  .card-meta { display: flex; gap: 0.5rem; align-items: center; font-size: 0.68rem; color: #8a7660; }
  .card-meta span + span::before { content: "·"; margin-right: 0.5rem; }
  .card-date { font-size: 0.68rem; color: #8a7660; margin-top: 0.25rem; }
  .loading { display: flex; align-items: center; justify-content: center; padding: 4rem; font-size: 0.78rem; color: #8a7660; letter-spacing: 0.1em; }
  .empty-state { padding: 4rem 2.5rem; text-align: center; color: #8a7660; font-size: 0.88rem; }

  .modal-bg { position: fixed; inset: 0; z-index: 200; background: rgba(10,6,2,0.75); display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .modal { background: #f0ece4; max-width: 760px; width: 100%; max-height: 88vh; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; position: relative; }
  .modal-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(15%); }
  .modal-no-img { background: #d4cabb; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #8a7660; min-height: 300px; }
  .modal-body { padding: 2.5rem 2rem; display: flex; flex-direction: column; }
  .modal-era { font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8a7660; margin-bottom: 0.75rem; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 400; color: #2c2318; line-height: 1.2; margin-bottom: 0.5rem; }
  .modal-category { font-size: 0.7rem; color: #8a7660; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(44,35,24,0.12); }
  .modal-desc { font-size: 0.88rem; color: #4a3c2c; line-height: 1.8; flex: 1; }
  .modal-date { font-size: 0.75rem; color: #8a7660; margin-top: 1.5rem; font-style: italic; }
  .modal-close { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.4); border: none; cursor: pointer; color: #f0e8d8; font-size: 1.25rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }

  .admin-page { padding-top: 72px; min-height: 100vh; }
  .admin-header { padding: 2rem 2.5rem; border-bottom: 1px solid rgba(44,35,24,0.12); display: flex; align-items: flex-end; justify-content: space-between; }
  .admin-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; color: #2c2318; }
  .admin-subtitle { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #8a7660; margin-top: 0.2rem; }
  .add-btn { background: #2c2318; color: #f0e8d8; border: none; padding: 0.7rem 1.5rem; cursor: pointer; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; }
  .add-btn:hover { background: #3d3020; }
  .admin-list { padding: 2rem 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .admin-row { background: #e8e0d0; border: 1px solid rgba(44,35,24,0.08); display: flex; align-items: center; gap: 1.25rem; padding: 1rem 1.25rem; }
  .admin-row-img { width: 60px; height: 60px; object-fit: cover; filter: sepia(15%); flex-shrink: 0; }
  .admin-row-no-img { width: 60px; height: 60px; background: #d4cabb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7660; }
  .admin-row-info { flex: 1; }
  .admin-row-title { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: #2c2318; margin-bottom: 0.2rem; }
  .admin-row-meta { font-size: 0.68rem; color: #8a7660; }
  .admin-row-actions { display: flex; gap: 0.5rem; }
  .edit-btn, .del-btn { background: none; border: 1px solid rgba(44,35,24,0.2); padding: 0.35rem 0.75rem; cursor: pointer; font-family: 'Raleway', sans-serif; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5c48; transition: all 0.2s; }
  .edit-btn:hover { background: #2c2318; color: #f0e8d8; border-color: #2c2318; }
  .del-btn:hover { background: #7a1e1e; color: #f0e8d8; border-color: #7a1e1e; }

  .form-modal-bg { position: fixed; inset: 0; z-index: 200; background: rgba(10,6,2,0.75); display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .form-modal { background: #f0ece4; width: 100%; max-width: 560px; padding: 2.5rem; max-height: 90vh; overflow-y: auto; }
  .form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 400; color: #2c2318; margin-bottom: 2rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-label { display: block; margin-bottom: 0.4rem; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6b5c48; font-weight: 500; }
  .form-input, .form-select, .form-textarea { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid rgba(44,35,24,0.2); background: #e8e0d0; font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #2c2318; outline: none; transition: border-color 0.2s; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: rgba(44,35,24,0.5); }
  .form-textarea { min-height: 100px; resize: vertical; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-actions { display: flex; gap: 0.75rem; margin-top: 2rem; justify-content: flex-end; }
  .cancel-btn { background: none; border: 1px solid rgba(44,35,24,0.2); padding: 0.65rem 1.25rem; cursor: pointer; font-family: 'Raleway', sans-serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5c48; }
  .save-btn { background: #2c2318; color: #f0e8d8; border: none; padding: 0.65rem 1.5rem; cursor: pointer; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .upload-area { border: 2px dashed rgba(44,35,24,0.25); padding: 1.5rem; text-align: center; cursor: pointer; background: #e8e0d0; transition: border-color 0.2s; }
  .upload-area:hover { border-color: rgba(44,35,24,0.5); }
  .upload-preview { width: 100%; max-height: 180px; object-fit: cover; margin-top: 0.75rem; filter: sepia(15%); display: block; }
  .upload-hint { font-size: 0.75rem; color: #6b5c48; }
  .upload-sub { font-size: 0.65rem; color: #8a7660; margin-top: 0.25rem; }
  .login-error { font-size: 0.78rem; color: #7a1e1e; margin-bottom: 1rem; padding: 0.6rem 0.85rem; background: rgba(122,30,30,0.08); border-left: 2px solid #7a1e1e; }

  .about-page { padding-top: 72px; min-height: 100vh; }
  .about-inner { max-width: 720px; margin: 0 auto; padding: 4rem 2rem; }
  .about-title { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 300; color: #2c2318; margin-bottom: 0.5rem; }
  .about-rule { width: 60px; height: 1px; background: #8a7660; margin: 1.5rem 0; }
  .about-text { font-size: 0.9rem; line-height: 1.9; color: #4a3c2c; }
`;

const BLANK_FORM = { title: "", era: "World War I", category: "Uniforms", date_period: "", description: "" };

export default function App() {
  const [page, setPage] = useState("landing");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eraFilter, setEraFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(false);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroFade(true);
      setTimeout(() => { setHeroIdx(i => (i + 1) % HERO_IMAGES.length); setHeroFade(false); }, 600);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from("collection_items").select("*").order("created_at", { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) setLoginError(error.message);
    else { setShowLogin(false); setPage("admin"); }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setPage("gallery");
  }

  function openAdd() {
    setEditItem(null); setForm(BLANK_FORM); setImageFile(null); setImagePreview(null); setShowForm(true);
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({ title: item.title, era: item.era || "World War I", category: item.category || "Uniforms", date_period: item.date_period || "", description: item.description || "" });
    setImageFile(null); setImagePreview(item.image_url || null); setShowForm(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function saveForm() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      let image_url = editItem?.image_url || null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const filename = `${Date.now()}.${ext}`;
        const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(filename, imageFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
        image_url = publicUrl;
      }
      const payload = { ...form, image_url };
      const { error } = editItem
        ? await supabaseAdmin.from("collection_items").update(payload).eq("id", editItem.id)
        : await supabaseAdmin.from("collection_items").insert([payload]);
      if (error) throw error;
      await fetchItems();
      setShowForm(false);
    } catch (err) {
      alert("Error saving: " + err.message);
    }
    setSaving(false);
  }

  async function deleteItem(id) {
    if (!confirm("Remove this item from the archive?")) return;
    await supabaseAdmin.from("collection_items").delete().eq("id", id);
    await fetchItems();
  }

  const filtered = items.filter(it =>
    (eraFilter === "All" || it.era === eraFilter) &&
    (catFilter === "All" || it.category === catFilter)
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* NAV */}
        <nav className={page === "landing" ? "nav-dark" : "nav-light"}>
          <div onClick={() => setPage("landing")} style={{ cursor: "pointer" }}>
            <div className="nav-brand">The Collection</div>
            <div className="nav-brand-sub">Military Memorabilia Museum</div>
          </div>
          <div className="nav-links">
            <button onClick={() => setPage("gallery")}>Gallery</button>
            <button onClick={() => setPage("about")}>About</button>
            {session ? (
              <>
                <button className="muted-btn" onClick={() => setPage("admin")}>&#9675; Add Item</button>
                <button className="muted-btn" onClick={handleSignOut}>&#8617; Sign Out</button>
              </>
            ) : (
              <button className="muted-btn" onClick={() => setShowLogin(true)}>Sign In</button>
            )}
          </div>
        </nav>

        {/* LANDING */}
        {page === "landing" && (
          <div className="landing">
            <img src={HERO_IMAGES[heroIdx]} className={`hero-img${heroFade ? " fade-out" : ""}`} alt="" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <p className="hero-eyebrow">A Private Military Memorabilia Museum</p>
              <h1 className="hero-title">The Collection</h1>
              <p className="hero-tagline">Honoring those who answered the call.</p>
              <button className="enter-btn" onClick={() => setPage("gallery")}>Enter the Collection</button>
            </div>
            <div className="hero-dots">
              {HERO_IMAGES.map((_, i) => <div key={i} className={`hero-dot${i === heroIdx ? " active" : ""}`} onClick={() => setHeroIdx(i)} />)}
            </div>
            <div className="hero-footer">A Private Military Memorabilia Museum</div>
          </div>
        )}

        {/* GALLERY */}
        {page === "gallery" && (
          <div className="gallery-page">
            <div className="gallery-header">
              <p className="gallery-desc">A curated collection of military artifacts, documents, and memorabilia spanning conflicts from the Civil War through the modern era. Each piece carries with it a story worth preserving.</p>
            </div>
            <div className="filters">
              <div className="filter-col">
                <span className="filter-label">Era</span>
                <div className="filter-row">
                  {ERAS.map(e => <button key={e} className={`filter-btn${eraFilter === e ? " active" : ""}`} onClick={() => setEraFilter(e)}>{e}</button>)}
                </div>
              </div>
              <div className="filter-col">
                <span className="filter-label">Category</span>
                <div className="filter-row">
                  {CATEGORIES.map(c => <button key={c} className={`filter-btn${catFilter === c ? " active" : ""}`} onClick={() => setCatFilter(c)}>{c}</button>)}
                </div>
              </div>
            </div>
            {loading ? (
              <div className="loading">Loading collection...</div>
            ) : (
              <>
                <div className="item-count">{filtered.length} {filtered.length === 1 ? "Item" : "Items"}</div>
                <div className="grid">
                  {filtered.map(item => (
                    <div key={item.id} className="card" onClick={() => setSelectedItem(item)}>
                      {item.image_url ? <img src={item.image_url} className="card-img" alt={item.title} /> : <div className="card-no-img">No Photo</div>}
                      <div className="card-body">
                        <div className="card-title">{item.title}</div>
                        <div className="card-meta"><span>{item.era}</span><span>{item.category}</span></div>
                        {item.date_period && <div className="card-date">{item.date_period}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                {filtered.length === 0 && <div className="empty-state">No items match the selected filters.</div>}
              </>
            )}
          </div>
        )}

        {/* ABOUT */}
        {page === "about" && (
          <div className="about-page">
            <div className="about-inner">
              <h1 className="about-title">About the Archive</h1>
              <div className="about-rule" />
              <p className="about-text">
                This collection represents a lifetime of careful preservation — a dedication to honoring the men and women who served across generations of American history. Each artifact was acquired with respect for its origin and the story it carries.<br /><br />
                From the fields of the Civil War to the theaters of the Second World War, these items are more than relics. They are tangible connections to those who sacrificed, served, and shaped the nation we know today.<br /><br />
                This archive exists to ensure those stories are never forgotten.
              </p>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {page === "admin" && session && (
          <div className="admin-page">
            <div className="admin-header">
              <div>
                <div className="admin-title">Manage Collection</div>
                <div className="admin-subtitle">Add, edit, or remove items</div>
              </div>
              <button className="add-btn" onClick={openAdd}>+ Add Item</button>
            </div>
            <div className="admin-list">
              {items.map(item => (
                <div key={item.id} className="admin-row">
                  {item.image_url ? <img src={item.image_url} className="admin-row-img" alt={item.title} /> : <div className="admin-row-no-img">No Photo</div>}
                  <div className="admin-row-info">
                    <div className="admin-row-title">{item.title}</div>
                    <div className="admin-row-meta">{item.era} · {item.category}{item.date_period ? ` · ${item.date_period}` : ""}</div>
                  </div>
                  <div className="admin-row-actions">
                    <button className="edit-btn" onClick={() => openEdit(item)}>Edit</button>
                    <button className="del-btn" onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAIL MODAL */}
        {selectedItem && (
          <div className="modal-bg" onClick={() => setSelectedItem(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              {selectedItem.image_url ? <img src={selectedItem.image_url} className="modal-img" alt={selectedItem.title} /> : <div className="modal-no-img">No Photo</div>}
              <div className="modal-body">
                <div className="modal-era">{selectedItem.era}</div>
                <div className="modal-title">{selectedItem.title}</div>
                <div className="modal-category">{selectedItem.category}</div>
                <div className="modal-desc">{selectedItem.description || "No description provided."}</div>
                {selectedItem.date_period && <div className="modal-date">{selectedItem.date_period}</div>}
              </div>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
            </div>
          </div>
        )}

        {/* LOGIN MODAL */}
        {showLogin && (
          <div className="modal-bg" onClick={() => setShowLogin(false)}>
            <div style={{ background: "#f0ece4", maxWidth: 400, width: "100%", padding: "3rem" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "#2c2318", marginBottom: "0.25rem" }}>Curator Sign In</div>
              <div style={{ fontSize: "0.7rem", color: "#8a7660", letterSpacing: "0.1em", marginBottom: "2rem" }}>Restricted to authorized curator only</div>
              {loginError && <div className="login-error">{loginError}</div>}
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password" required />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowLogin(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Sign In</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="form-modal-bg">
            <div className="form-modal">
              <div className="form-title">{editItem ? "Edit Item" : "Add New Item"}</div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. M1 Steel Helmet with Liner" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Era</label>
                  <select className="form-select" value={form.era} onChange={e => setForm(f => ({ ...f, era: e.target.value }))}>
                    {ERAS.filter(e => e !== "All").map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date / Period</label>
                <input className="form-input" value={form.date_period} onChange={e => setForm(f => ({ ...f, date_period: e.target.value }))} placeholder="e.g. c. 1944" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the item, its history, condition, and significance..." />
              </div>
              <div className="form-group">
                <label className="form-label">Photo</label>
                <div className="upload-area" onClick={() => fileRef.current.click()}>
                  {imagePreview
                    ? <img src={imagePreview} className="upload-preview" alt="Preview" />
                    : <>
                        <div className="upload-hint">Click to upload a photo</div>
                        <div className="upload-sub">JPG or PNG, up to 10MB</div>
                      </>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="save-btn" onClick={saveForm} disabled={saving}>{saving ? "Saving..." : editItem ? "Save Changes" : "Add to Archive"}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
