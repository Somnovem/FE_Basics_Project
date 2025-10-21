import { useState, useEffect } from "react";
import "./App.css";

const DEMO = [
  { id: 101, title: "Love Session", artist: "Amor", year: 1976, genre: "70s", price: 24.99, cover: "https://picsum.photos/seed/1/400/400", samples: [], rating: 4.5 },
  { id: 102, title: "Neon Nights", artist: "Synthwave", year: 1984, genre: "80s", price: 18.5, cover: "https://picsum.photos/seed/2/400/400", samples: [], rating: 4.2 },
  { id: 103, title: "Blue Notes", artist: "Classic Jazz", year: 1969, genre: "jazz", price: 29.0, cover: "https://picsum.photos/seed/3/400/400", samples: [], rating: 4.9 },
  { id: 104, title: "Sunset Ride", artist: "Funk Band", year: 1972, genre: "70s", price: 21.0, cover: "https://picsum.photos/seed/4/400/400", samples: [], rating: 4.0 },
  { id: 105, title: "Electric Heart", artist: "Pop Star", year: 1988, genre: "80s", price: 15.75, cover: "https://picsum.photos/seed/5/400/400", samples: [], rating: 3.9 },
];

export default function App() {
  const [records] = useState(DEMO);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "{}"));
  const [playlist, setPlaylist] = useState(() => JSON.parse(localStorage.getItem("playlist") || "[]"));
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [modal, setModal] = useState(null);
  const [panel, setPanel] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [cart, playlist]);

  const genres = ["all", ...new Set(records.map(r => r.genre))];
  const filtered = records.filter(
    r =>
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.artist.toLowerCase().includes(search.toLowerCase())) &&
      (genre === "all" || r.genre === genre)
  );

  const addToCart = id => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const updateQty = (id, qty) => {
    setCart(prev => {
      const updated = { ...prev };
      if (qty <= 0) delete updated[id];
      else updated[id] = qty;
      return updated;
    });
  };
  const togglePlaylist = id =>
    setPlaylist(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);
  const total = Object.entries(cart).reduce((s, [id, qty]) => {
    const rec = records.find(r => r.id === Number(id));
    return s + (rec?.price || 0) * qty;
  }, 0);

  return (
    <div className="app modern">
      {/* HEADER */}
      <header className="header">
        <div className="logo">🎵 Vinyl.Store</div>
        <div className="header-right">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={() => setPanel("cart")}>🛒 {cartCount}</button>
        </div>
      </header>

      {/* FILTER */}
      <div className="filter">
        <label>Genre:</label>
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          {genres.map(g => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* CATALOG */}
      <main className="catalog">
        {filtered.length ? (
          filtered.map(r => (
            <div className="card" key={r.id}>
              <img src={r.cover} alt={r.title} onClick={() => setModal(r)} />
              <h3>{r.title}</h3>
              <p>{r.artist} • {r.year}</p>
              <p className="price">${r.price.toFixed(2)}</p>
              <div className="buttons">
                <button onClick={() => addToCart(r.id)}>Add to Cart</button>
                <button onClick={() => togglePlaylist(r.id)}>
                  {playlist.includes(r.id) ? "♥ In Playlist" : "♡ Playlist"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No records found.</p>
        )}
      </main>

      {/* MODAL */}
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModal(null)}>&times;</span>
            <img src={modal.cover} alt={modal.title} />
            <h2>{modal.title}</h2>
            <p>{modal.artist} • {modal.year} • {modal.genre}</p>
            <p>Rating: {modal.rating}/5</p>
            <button onClick={() => { addToCart(modal.id); setModal(null); }}>
              Add to Cart — ${modal.price.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* CART PANEL */}
      {panel === "cart" && (
        <div className="cart-panel">
          <h3>Cart</h3>
          {Object.entries(cart).length ? (
            Object.entries(cart).map(([id, qty]) => {
              const rec = records.find(r => r.id == id);
              return (
                <div key={id} className="cart-item">
                  <img src={rec.cover} alt="" />
                  <div>
                    <p>{rec.title}</p>
                    <p className="small">{qty} × ${rec.price.toFixed(2)}</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={qty}
                    onChange={e => updateQty(id, Number(e.target.value))}
                  />
                </div>
              );
            })
          ) : (
            <p>Cart is empty</p>
          )}
          <p className="total">Total: ${total.toFixed(2)}</p>
          <button onClick={() => setPanel(null)}>Close</button>
        </div>
      )}
    </div>
  );
}