import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cart, setCart] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");

  useEffect(() => {
    const DEMO = [
      {
        id: 1,
        title: "Dark Side of the Moon",
        artist: "Pink Floyd",
        year: 1973,
        genre: "Rock",
        price: 24.99,
        cover: "https://i.imgur.com/2zQ3Z7F.jpeg",
        samples: ["/samples/pinkfloyd.mp3"],
      },
      {
        id: 2,
        title: "Kind of Blue",
        artist: "Miles Davis",
        year: 1959,
        genre: "Jazz",
        price: 19.99,
        cover: "https://i.imgur.com/3Yk2GJQ.jpeg",
        samples: ["/samples/milesdavis.mp3"],
      },
    ];
    setRecords(DEMO);
    setFiltered(DEMO);
  }, []);

  useEffect(() => {
    const f = records.filter(
      (r) =>
        (r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.artist.toLowerCase().includes(search.toLowerCase())) &&
        (genre === "all" || r.genre === genre)
    );
    setFiltered(f);
  }, [search, genre, records]);

  const openDetails = (rec) => setModal(rec);
  const closeModal = () => setModal(null);

  const addToCart = (rec) => setCart((prev) => [...prev, rec]);
  const togglePlaylist = (rec) =>
    setPlaylist((prev) =>
      prev.includes(rec.id)
        ? prev.filter((id) => id !== rec.id)
        : [...prev, rec.id]
    );

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="logo">Vinyl Store</h1>
        <div className="filters">
          <input
            className="input"
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="all">Всі жанри</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
          </select>
        </div>
      </header>

      <main className="container">
        <div className="catalog">
          {filtered.map((rec) => (
            <div key={rec.id} className="card">
              <img src={rec.cover} alt={rec.title} className="cover" />
              <h3>{rec.title}</h3>
              <p className="muted">
                {rec.artist} • {rec.year}
              </p>
              <p>${rec.price.toFixed(2)}</p>
              <div className="actions">
                <button onClick={() => openDetails(rec)}>Деталі</button>
                <button onClick={() => addToCart(rec)}>🛒</button>
                <button onClick={() => togglePlaylist(rec)}>🎵</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modal.cover} alt={modal.title} />
            <h3>{modal.title}</h3>
            <p className="muted">
              {modal.artist} • {modal.year} • {modal.genre}
            </p>
            <audio controls src={modal.samples[0]} />
            <button onClick={() => addToCart(modal)}>
              Add to cart — ${modal.price.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
