import { useState, useEffect, useRef } from "react";

// ─── CONFIG ─────────────────────────────────────────────────────
const DATAFILE_ID = "b5cdc8249610457d80bdeb212c197a4e";
const API_KEY =
"dd95cb9be05830714be4f7ae5f16e2a2345764001f5d2937cc12602b7602d2cd5a8e4c8e58f16035c0fb29dc0e93477d";

// ─── STYLES ─────────────────────────────────────────────────────
const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
`;

const css = `
  :root {
    --bg-deep: #0a0a0f;
    --bg-card: #14141f;
    --bg-hover: #1e1e2e;
    --accent: #e50914;
    --accent-glow: rgba(229, 9, 20, 0.4);
    --text-primary: #f1f1f1;
    --text-muted: #8a8a9a;
    --text-dim: #55556a;
    --gold: #f5c518;
    --gradient-fade: linear-gradient(to right, #0a0a0f 0%, transparent
15%, transparent 85%, #0a0a0f 100%);
    --gradient-bottom: linear-gradient(to top, #0a0a0f 0%, transparent 100%);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg-deep);
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── NOISE OVERLAY ── */
  .noise-overlay {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256
256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter
id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'
numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect
width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .app-container {
    position: relative; z-index: 1; min-height: 100vh;
    padding-bottom: 60px;
  }

  /* ── NAVBAR ── */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 48px;
    background: linear-gradient(to bottom, rgba(10,10,15,0.95) 0%,
rgba(10,10,15,0) 100%);
    backdrop-filter: blur(8px);
    transition: background 0.3s;
  }
  .navbar.scrolled {
    background: rgba(10,10,15,0.97);
  }
  .nav-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px; letter-spacing: 3px;
    color: var(--accent);
    text-shadow: 0 0 20px var(--accent-glow);
    cursor: pointer;
  }
  .nav-brand span { color: var(--text-primary); font-size: 20px;
letter-spacing: 1px; margin-left: 6px; opacity: 0.5; }

  /* ── SEARCH / CHAT ── */
  .search-section {
    max-width: 720px; margin: 0 auto; padding: 40px 48px 20px;
  }
  .search-bar {
    display: flex; align-items: center; gap: 12px;
    background: var(--bg-card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 6px 6px 6px 24px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .search-bar:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 30px var(--accent-glow);
  }
  .search-bar input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--text-primary); font-size: 16px;
    font-family: 'DM Sans', sans-serif;
  }
  .search-bar input::placeholder { color: var(--text-dim); }
  .search-btn {
    background: var(--accent); border: none; border-radius: 12px;
    padding: 14px 28px; color: white; font-weight: 700;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .search-btn:hover { transform: scale(1.03); box-shadow: 0 4px 20px
var(--accent-glow); }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── SUGGESTION CHIPS ── */
  .chips {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 16px 48px; max-width: 720px; margin: 0 auto;
  }
  .chip {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px; padding: 8px 18px;
    font-size: 13px; color: var(--text-muted);
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .chip:hover { background: rgba(229,9,20,0.12); border-color:
var(--accent); color: var(--text-primary); }

  /* ── AI RESPONSE ── */
  .ai-response {
    max-width: 720px; margin: 12px auto 0; padding: 0 48px;
  }
  .ai-bubble {
    background: linear-gradient(135deg, rgba(229,9,20,0.06) 0%,
rgba(20,20,31,0.9) 100%);
    border: 1px solid rgba(229,9,20,0.15);
    border-radius: 16px; padding: 20px 24px;
    font-size: 15px; line-height: 1.7; color: var(--text-muted);
    animation: fadeUp 0.4s ease-out;
  }
  .ai-label {
    font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px;
    font-size: 12px; color: var(--accent); margin-bottom: 8px;
  }

  /* ── HERO BILLBOARD ── */
  .hero {
    position: relative; width: 100%; height: 520px;
    margin-bottom: 20px; overflow: hidden;
  }
  .hero-backdrop {
    position: absolute; inset: 0;
    background-size: cover; background-position: center top;
    filter: brightness(0.5);
    transition: opacity 1s ease;
  }
  .hero-gradient {
    position: absolute; inset: 0;
    background:
      linear-gradient(to top, var(--bg-deep) 0%, transparent 50%),
      linear-gradient(to right, var(--bg-deep) 0%, transparent 60%);
  }
  .hero-content {
    position: absolute; bottom: 80px; left: 48px; max-width: 520px;
    z-index: 2;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 56px; letter-spacing: 2px; line-height: 1;
    margin-bottom: 12px;
    text-shadow: 0 2px 30px rgba(0,0,0,0.7);
  }
  .hero-meta {
    display: flex; align-items: center; gap: 12px;
    font-size: 14px; color: var(--text-muted); margin-bottom: 14px;
  }
  .hero-rating { color: var(--gold); font-weight: 700; }
  .hero-dot { width: 4px; height: 4px; border-radius: 50%; background:
var(--text-dim); }
  .hero-overview {
    font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.7);
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient:
vertical; overflow: hidden;
  }

  /* ── ROW ── */
  .row-section { margin-bottom: 36px; }
  .row-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 2px;
    padding: 0 48px; margin-bottom: 14px;
    color: var(--text-primary);
  }
  .row-scroll-wrapper { position: relative; }
  .row-scroll-wrapper::before,
  .row-scroll-wrapper::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 48px;
    z-index: 2; pointer-events: none;
  }
  .row-scroll-wrapper::before { left: 0; background:
linear-gradient(to right, var(--bg-deep), transparent); }
  .row-scroll-wrapper::after { right: 0; background:
linear-gradient(to left, var(--bg-deep), transparent); }

  .row-track {
    display: flex; gap: 14px;
    padding: 0 48px; overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .row-track::-webkit-scrollbar { display: none; }

  /* ── CARD ── */
  .card {
    flex: 0 0 180px; cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .card:hover { transform: scale(1.08); z-index: 3; }
  .card-poster {
    width: 180px; height: 270px;
    border-radius: 10px; overflow: hidden;
    background: var(--bg-card);
    position: relative;
  }
  .card-poster img {
    width: 100%; height: 100%; object-fit: cover;
    transition: filter 0.3s;
  }
  .card:hover .card-poster img { filter: brightness(1.1); }
  .card-poster .rating-badge {
    position: absolute; top: 8px; right: 8px;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
    border-radius: 8px; padding: 4px 8px;
    font-size: 12px; font-weight: 700; color: var(--gold);
    display: flex; align-items: center; gap: 3px;
  }
  .card-info { padding: 10px 2px; }
  .card-title {
    font-size: 14px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .card-year { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

  /* ── PLACEHOLDER POSTER ── */
  .poster-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; letter-spacing: 2px;
    color: var(--text-dim); text-align: center;
    padding: 16px;
  }

  /* ── DETAIL MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.25s ease-out;
    padding: 24px;
  }
  .modal {
    background: var(--bg-card);
    border-radius: 20px; overflow: hidden;
    max-width: 700px; width: 100%;
    max-height: 85vh; overflow-y: auto;
    box-shadow: 0 25px 80px rgba(0,0,0,0.6);
    animation: scaleUp 0.3s ease-out;
  }
  .modal-banner {
    position: relative; width: 100%; height: 300px;
    background: var(--bg-card);
  }
  .modal-banner img { width: 100%; height: 100%; object-fit: cover;
filter: brightness(0.6); }
  .modal-banner-gradient {
    position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
    background: linear-gradient(to top, var(--bg-card), transparent);
  }
  .modal-close {
    position: absolute; top: 16px; right: 16px;
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(0,0,0,0.6); border: none;
    color: white; font-size: 20px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .modal-close:hover { background: var(--accent); }
  .modal-body { padding: 24px 32px 32px; }
  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px; letter-spacing: 2px; margin-bottom: 8px;
  }
  .modal-meta {
    display: flex; gap: 16px; font-size: 14px; color: var(--text-muted);
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .modal-overview {
    font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.75);
    margin-bottom: 24px;
  }
  .modal-genres {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .genre-tag {
    padding: 6px 14px; border-radius: 999px;
    font-size: 12px; font-weight: 600;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-muted);
  }

  /* ── LOADING ── */
  .loader {
    display: flex; align-items: center; justify-content: center;
    padding: 60px; gap: 6px;
  }
  .loader-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    animation: bounce 1.2s infinite;
  }
  .loader-dot:nth-child(2) { animation-delay: 0.15s; }
  .loader-dot:nth-child(3) { animation-delay: 0.3s; }

  .empty-state {
    text-align: center; padding: 80px 24px;
    color: var(--text-dim); font-size: 16px;
  }
  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }

  /* ── ANIMATIONS ── */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px);
} to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to
{ opacity: 1; transform: scale(1); } }
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
  }
  @keyframes stagger { from { opacity: 0; transform: translateY(20px);
} to { opacity: 1; transform: translateY(0); } }

  .stagger-in { animation: stagger 0.5s ease-out forwards; opacity: 0; }

  @media (max-width: 640px) {
    .navbar { padding: 12px 20px; }
    .search-section { padding: 24px 20px 12px; }
    .chips { padding: 12px 20px; }
    .ai-response { padding: 0 20px; }
    .row-title { padding: 0 20px; }
    .row-track { padding: 0 20px; gap: 10px; }
    .hero-content { left: 20px; bottom: 60px; }
    .hero-title { font-size: 36px; }
    .card { flex: 0 0 140px; }
    .card-poster { width: 140px; height: 210px; }
  }
`;

// ─── HELPER: Query Snow Leopard ─────────────────────────────────
async function querySnowLeopard(naturalLanguageQuery) {
  const response = await fetch(
    `https://api.snowleopard.ai/datafiles/${DATAFILE_ID}/retrieve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        userQuery: naturalLanguageQuery,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Snow Leopard API error: ${response.status}`);
  }

  const data = await response.json();
  // Response shape: { data: [{ rows: [...], querySummary: {non_technical_explanation }, query }] }
  const schemaData = data.data?.[0] || {};
  return {
    rows: schemaData.rows || [],
    explanation: schemaData.querySummary?.non_technical_explanation || "",
    sql: schemaData.query || "",
  };
}

// ─── PLACEHOLDER DATA (fallback / demo) ─────────────────────────
const DEMO_MOVIES = [
  { id: 1, title: "Inception", year: 2010, rating: 8.8, genre:
"Sci-Fi, Action", overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.", poster:
"https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg" },
  { id: 2, title: "The Dark Knight", year: 2008, rating: 9.0, genre:
"Action, Crime", overview: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.",
poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BOlluX5OCNwJ.jpg"
},
  { id: 3, title: "Interstellar", year: 2014, rating: 8.7, genre:
"Sci-Fi, Drama", overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
},
  { id: 4, title: "Pulp Fiction", year: 1994, rating: 8.9, genre:
"Crime, Drama", overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", poster:
"https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
  { id: 5, title: "The Matrix", year: 1999, rating: 8.7, genre:
"Sci-Fi, Action", overview: "A computer programmer discovers that reality as he knows it is a simulation created by machines.", poster:
"https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
  { id: 6, title: "Parasite", year: 2019, rating: 8.5, genre:
"Thriller, Drama", overview: "Greed and class discrimination threaten the symbiotic relationship between the wealthy Park family and the destitute Kim clan.", poster:
"https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
];

// ─── COMPONENTS ─────────────────────────────────────────────────

function MovieCard({ movie, onClick, index }) {
  // Snow Leopard returns: Title, Rating, TotalVotes, Movie_id
  // Title format: "Inception (2010)" — extract year from title
  const rawTitle = movie.Title || movie.title || "";
  const yearMatch = rawTitle.match(/\((\d{4})\)/);
  const year = yearMatch ? yearMatch[1] : (movie.year ||
movie.release_year || "");
  const title = rawTitle.replace(/\s*\((\d{4})\)/,
"").replace(/\u00a0/g, " ").trim();
  const poster = movie.poster || movie.poster_url || movie.poster_path;
  const rating = movie.Rating || movie.rating || movie.vote_average;
  const votes = movie.TotalVotes;

  return (
    <div
      className="card stagger-in"
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => onClick(movie)}
    >
      <div className="card-poster">
        {poster ? (
          <img src={poster} alt={title} loading="lazy" />
        ) : (
          <div className="poster-placeholder">{title}</div>
        )}
        {rating && (
          <div className="rating-badge">★ {Number(rating).toFixed(1)}</div>
        )}
      </div>
      <div className="card-info">
        <div className="card-title">{title}</div>
        {year && <div className="card-year">{year}{votes ? ` ·
${Number(votes).toLocaleString()} votes` : ""}</div>}
      </div>
    </div>
  );
}

function MovieRow({ title, movies, onCardClick }) {
  const trackRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="row-section">
      <div className="row-title">{title}</div>
      <div className="row-scroll-wrapper">
        <div className="row-track" ref={trackRef}>
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id || i}
              movie={movie}
              index={i}
              onClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailModal({ movie, onClose }) {
  if (!movie) return null;

  const rawTitle = movie.Title || movie.title || "";
  const yearMatch = rawTitle.match(/\((\d{4})\)/);
  const year = yearMatch ? yearMatch[1] : (movie.year || "");
  const title = rawTitle.replace(/\s*\((\d{4})\)/,
"").replace(/\u00a0/g, " ").trim();
  const poster = movie.poster || movie.poster_url || movie.poster_path;
  const rating = movie.Rating || movie.rating || movie.vote_average;
  const votes = movie.TotalVotes;
  const genres = movie.genre || movie.genres || movie.Genre || "";
  const genreList = typeof genres === "string"
    ? genres.split(",").map((g) => g.trim()).filter(Boolean)
    : Array.isArray(genres) ? genres : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-banner">
          {poster ? (
            <img src={poster} alt={title} />
          ) : (
            <div className="poster-placeholder" style={{ height:
"100%" }}>{title}</div>
          )}
          <div className="modal-banner-gradient" />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-title">{title}</div>
          <div className="modal-meta">
            {year && <span>{year}</span>}
            {rating && <span style={{ color: "var(--gold)",
fontWeight: 700 }}>★ {Number(rating).toFixed(1)}</span>}
            {votes && <span>{Number(votes).toLocaleString()} votes</span>}
            {movie.runtime && <span>{movie.runtime} min</span>}
            {movie.director && <span>Dir. {movie.director}</span>}
          </div>
          {movie.overview && <div
className="modal-overview">{movie.overview}</div>}
          {genreList.length > 0 && (
            <div className="modal-genres">
              {genreList.map((g, i) => (
                <span className="genre-tag" key={i}>{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="loader">
      <div className="loader-dot" />
      <div className="loader-dot" />
      <div className="loader-dot" />
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────
export default function MovieBrowser() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [useDemoData, setUseDemoData] = useState(false); // Live API by default

  const suggestions = [
    "Show me the top 10 highest rated movies",
    "Movies with rating above 8.5",
    "Which movies have the most votes?",
    "Show me all movies from 2016",
    "What are the lowest rated movies?",
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setAiMessage("");
    setResults(null);

    if (useDemoData) {
      // Demo mode — simulate a response
      await new Promise((r) => setTimeout(r, 800));
      setAiMessage(`Here are some results for "${q}". In live mode,
this connects to Snow Leopard's API to run natural language queries
against your movie database.`);
      setResults({ movies: DEMO_MOVIES });
      setLoading(false);
      return;
    }

    try {
      const data = await querySnowLeopard(q);
      setResults({
        movies: data.rows || [],
      });
      setAiMessage(data.explanation || `Found ${(data.rows ||
[]).length} results.`);
      if (data.sql) console.log("SQL:", data.sql);
    } catch (err) {
      setAiMessage(`Something went wrong: ${err.message}. Make sure
your API key and endpoint are configured.`);
      setResults({ movies: [] });
    } finally {
      setLoading(false);
    }
  };

  const heroMovie = results?.movies?.[0] || (useDemoData ?
DEMO_MOVIES[0] : null);

  return (
    <>
      <style>{fonts}</style>
      <style>{css}</style>
      <div className="noise-overlay" />
      <div className="app-container">
        {/* ── Navbar ── */}
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-brand">
            CINEQUERY <span>AI</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontSize: 13, color: "var(--text-dim)",
display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!useDemoData}
                onChange={() => setUseDemoData(!useDemoData)}
                style={{ accentColor: "var(--accent)" }}
              />
              Live API
            </label>
          </div>
        </nav>

        {/* ── Search ── */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Ask anything about movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="search-btn"
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
            >
              {loading ? "Searching..." : "Ask AI"}
            </button>
          </div>
        </div>

        {/* ── Chips ── */}
        {!results && !loading && (
          <div className="chips">
            {suggestions.map((s, i) => (
              <div key={i} className="chip" onClick={() => handleSearch(s)}>
                {s}
              </div>
            ))}
          </div>
        )}

        {/* ── AI Response ── */}
        {aiMessage && (
          <div className="ai-response">
            <div className="ai-bubble">
              <div className="ai-label">CINEQUERY AI</div>
              {aiMessage}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <Loader />}

        {/* ── Hero Billboard ── */}
        {!loading && heroMovie && results && (() => {
          const rt = heroMovie.Title || heroMovie.title || "";
          const ym = rt.match(/\((\d{4})\)/);
          const hy = ym ? ym[1] : (heroMovie.year || "");
          const ht = rt.replace(/\s*\((\d{4})\)/,
"").replace(/\u00a0/g, " ").trim();
          const hr = heroMovie.Rating || heroMovie.rating;
          return (
            <div className="hero" style={{ marginTop: 24 }}>
              <div
                className="hero-backdrop"
                style={{
                  backgroundImage: `url(${heroMovie.poster ||
heroMovie.poster_url || ""})`,
                }}
              />
              <div className="hero-gradient" />
              <div className="hero-content">
                <div className="hero-title">{ht}</div>
                <div className="hero-meta">
                  {hr && (
                    <span className="hero-rating">★
{Number(hr).toFixed(1)}</span>
                  )}
                  <span className="hero-dot" />
                  <span>{hy}</span>
                  {heroMovie.TotalVotes && (
                    <>
                      <span className="hero-dot" />

<span>{Number(heroMovie.TotalVotes).toLocaleString()} votes</span>
                    </>
                  )}
                </div>
                {heroMovie.overview && (
                  <div className="hero-overview">{heroMovie.overview}</div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── Results Row ── */}
        {!loading && results?.movies?.length > 0 && (
          <MovieRow
            title="RESULTS"
            movies={results.movies}
            onCardClick={setSelectedMovie}
          />
        )}

        {/* ── Empty state ── */}
        {!loading && results && results.movies?.length === 0 && (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <div>No movies found. Try a different query!</div>
          </div>
        )}

        {/* ── Default rows when no search ── */}
        {!results && !loading && useDemoData && (
          <>
            <div className="hero" style={{ marginTop: 24 }}>
              <div
                className="hero-backdrop"
                style={{ backgroundImage: `url(${DEMO_MOVIES[0].poster})` }}
              />
              <div className="hero-gradient" />
              <div className="hero-content">
                <div className="hero-title">{DEMO_MOVIES[0].title}</div>
                <div className="hero-meta">
                  <span className="hero-rating">★ {DEMO_MOVIES[0].rating}</span>
                  <span className="hero-dot" />
                  <span>{DEMO_MOVIES[0].year}</span>
                  <span className="hero-dot" />
                  <span>{DEMO_MOVIES[0].genre}</span>
                </div>
                <div className="hero-overview">{DEMO_MOVIES[0].overview}</div>
              </div>
            </div>
            <MovieRow
              title="TRENDING NOW"
              movies={DEMO_MOVIES}
              onCardClick={setSelectedMovie}
            />
            <MovieRow
              title="TOP RATED"
              movies={[...DEMO_MOVIES].reverse()}
              onCardClick={setSelectedMovie}
            />
          </>
        )}

        {/* ── Detail Modal ── */}
        <DetailModal movie={selectedMovie} onClose={() =>
setSelectedMovie(null)} />
      </div>
    </>
  );
}