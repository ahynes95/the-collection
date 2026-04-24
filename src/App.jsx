import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://feazglrunmdmgugdhhnh.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET = "the-collection-images";

const ERAS = ["All","Civil War","World War I","World War II","Korean War","Vietnam War","Cold War","Gulf War","Modern Era","Other"];
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
  .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: sepia(60%) brightness(0.55) contrast(1.1); transition: opacity 1.2s ease; }
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
