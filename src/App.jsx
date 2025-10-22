import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

const DEMO = [
  {id:101,title:'Love Session',artist:'Amor',year:1976,genre:'70s',price:24.99,cover:'https://picsum.photos/seed/1/800/800',samples:['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],rating:4.5,reviews:['Great']},
  {id:102,title:'Neon Nights',artist:'Synthwave',year:1984,genre:'80s',price:18.50,cover:'https://picsum.photos/seed/2/800/800',samples:[],rating:4.2,reviews:[]},
  {id:103,title:'Blue Notes',artist:'Classic Jazz',year:1969,genre:'jazz',price:29.00,cover:'https://picsum.photos/seed/3/800/800',samples:[],rating:4.9,reviews:[]},
  {id:104,title:'Sunset Ride',artist:'Funk Band',year:1972,genre:'70s',price:21.00,cover:'https://picsum.photos/seed/4/800/800',samples:[],rating:4.0,reviews:[]},
  {id:105,title:'Electric Heart',artist:'Pop Star',year:1988,genre:'80s',price:15.75,cover:'https://picsum.photos/seed/5/800/800',samples:[],rating:3.9,reviews:[]},
  {id:106,title:'Indie Vibes',artist:'Local',year:2019,genre:'indie',price:17.20,cover:'https://picsum.photos/seed/6/800/800',samples:[],rating:4.1,reviews:[]},
  {id:107,title:'Groove Mix',artist:'DJ',year:1979,genre:'mix',price:12.5,cover:'https://picsum.photos/seed/7/800/800',samples:[],rating:4.3,reviews:[]},
  {id:108,title:'Placebo',artist:'Various',year:2000,genre:'rock',price:19.0,cover:'https://picsum.photos/seed/8/800/800',samples:[],rating:4.0,reviews:[]}
];

export default function App() {
  const [records, setRecords] = useState(DEMO);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("vinyl_cart") || "{}"));
  const [playlist, setPlaylist] = useState(() => JSON.parse(localStorage.getItem("vinyl_playlist") || "[]"));
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [modal, setModal] = useState(null);
  const [sideContent, setSideContent] = useState(null);

  useEffect(() => { localStorage.setItem("vinyl_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("vinyl_playlist", JSON.stringify(playlist)); }, [playlist]);

  const genres = useMemo(() => ["all", ...Array.from(new Set(records.map(r=>r.genre)))], [records]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter(r => {
      if (genre !== "all" && r.genre !== genre) return false;
      if (!q) return true;
      return (r.title + " " + r.artist + " " + r.genre + " " + r.year).toLowerCase().includes(q);
    });
  }, [records, search, genre]);

  const addToCart = (id, qty = 1) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + qty }));
    openCart();
  };
  const updateCartQty = (id, qty) => {
    if (qty <= 0) {
      const copy = { ...cart }; delete copy[id]; setCart(copy);
    } else {
      setCart(prev => ({ ...prev, [id]: qty }));
    }
  };

  const togglePlaylist = (id) => {
    setPlaylist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const openModal = (rec) => setModal(rec);
  const closeModal = () => setModal(null);

  function openCart() {
    const items = Object.entries(cart).map(([id,qty]) => ({ rec: records.find(r=>r.id==id), qty }));
    const total = items.reduce((s,it)=> s + (it.rec?.price||0) * it.qty, 0);
    setSideContent(
      <div className="side-card">
        <h4>Cart</h4>
        {items.length ? items.map(it => (
          <div key={it.rec.id} className="side-item">
            <img src={it.rec.cover} alt="" className="side-thumb"/>
            <div className="side-meta">
              <div className="side-title">{it.rec.title}</div>
              <div className="muted-small">{it.qty} × ${it.rec.price.toFixed(2)}</div>
            </div>
            <input
              type="number"
              className="side-qty"
              value={it.qty}
              min="0"
              onChange={(e)=> updateCartQty(it.rec.id, Number(e.target.value))}
            />
          </div>
        )) : <div className="muted-small">Cart is empty</div>}
        <div className="side-total">Total: ${total.toFixed(2)}</div>
        <div className="side-actions">
          <button className="btn-accent" onClick={()=> alert("Checkout (wire to /api/checkout)")}>Checkout</button>
          <button className="btn-surface" onClick={()=> setSideContent(null)}>Close</button>
        </div>
      </div>
    );
  }

  function openPlaylist() {
    const list = playlist.map(id => records.find(r=>r.id===id)).filter(Boolean);
    setSideContent(
      <div className="side-card">
        <h4>Playlist</h4>
        {list.length ? list.map(r => (
          <div className="side-item" key={r.id}>
            <img src={r.cover} alt="" className="side-thumb"/>
            <div className="side-meta">
              <div className="side-title">{r.title}</div>
              <div className="muted-small">{r.artist}</div>
            </div>
            <div className="side-playcontrols">
              <button className="btn-surface" onClick={()=> playSample(r)}>Play</button>
              <button className="btn-remove" onClick={()=> togglePlaylist(r.id)}>Remove</button>
            </div>
          </div>
        )) : <div className="muted-small">Playlist is empty</div>}
        <div className="side-actions"><button className="btn-surface" onClick={()=> setSideContent(null)}>Close</button></div>
      </div>
    );
  }

  function playSample(rec) {
    if(!rec || !rec.samples || !rec.samples.length) {
      alert("No sample available (demo). In production, samples[] should contain URLs.");
      return;
    }
    const audio = new Audio(rec.samples[0]);
    audio.play();
  }

  return (
    <div className="app-modern">
      <header className="topbar surface">
        <div className="container header-row">
          <div className="brand">
            <div className="brand-logo">V</div>
            <div>
              <div className="brand-title">vinyl.store</div>
              <div className="muted-small">collectors & lovers</div>
            </div>
          </div>

          <div className="header-actions">
            <nav className="nav-links">
              <a href="#new">New</a>
              <a href="#record">Record</a>
              <a href="#about">About</a>
              <a href="#buyers">Buyers</a>
            </nav>

            <div className="header-controls">
              <select className="filter-genre" value={genre} onChange={e=>setGenre(e.target.value)}>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>

              <button className="btn-surface" onClick={()=> openCart()}>Cart ({Object.values(cart).reduce((s,n)=>s+n,0)})</button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero surface">
          <div className="container hero-grid">
            <div>
              <h1 className="display hero-title">Record & vinyl market</h1>
              <p className="muted-small hero-sub">Expand your vinyl record collection and find the perfect second-hand or new release. Curated selection from vintage to contemporary.</p>

              <div className="hero-controls">
                <input
                  className="input-search"
                  placeholder="search the catalog"
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  onKeyDown={(e)=> { if(e.key === 'Enter') { /* apply */ } }}
                />
                <button className="btn-accent" onClick={()=> {/* optional server search hook */}}>Search</button>
                <button className="btn-surface" onClick={()=> { const rec = records[0]; if(rec) { document.getElementById('hero-record')?.classList.add('spin-fast'); setTimeout(()=> document.getElementById('hero-record')?.classList.remove('spin-fast'), 1400); }}}>Preview</button>
              </div>
            </div>

            <div className="hero-art">
              <div id="hero-record" className="record spin-slow" aria-hidden="true">
                <div className="record-label">45 RPM</div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="new" className="section">
          <div className="container">
            <div className="section-header">
              <h2>new products</h2>
              <div className="section-controls">
                <label htmlFor="genreFilter" className="sr-only">Genre</label>
                <select id="genreFilter" className="filter-genre" value={genre} onChange={e => setGenre(e.target.value)}>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid catalog-grid" role="list">
              {filtered.length ? filtered.map(r => (
                <article key={r.id} className="record-card" role="listitem" aria-label={`${r.title} — ${r.artist}`}>
                  <div className="record-thumb-wrap">
                    <div
                      className="vinyl-thumb"
                      role="button"
                      tabIndex={0}
                      onClick={() => openModal(r)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(r); }}
                      onMouseEnter={e => e.currentTarget.classList.add('spin-slow')}
                      onMouseLeave={e => e.currentTarget.classList.remove('spin-slow')}
                      style={{ backgroundImage: `url(${r.cover})` }}
                      aria-label={`${r.title} cover`}
                      />
                  </div>
                  
                  <div className="record-info">
                    <div className="record-title">{r.title}</div>
                    <div className="muted-small">{r.artist} • {r.year}</div>
                    <div className="price">${r.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="record-actions">
                    <button
                      className="btn-accent small"
                      onClick={() => addToCart(r.id)}
                      aria-label={`Add ${r.title} to cart`}
                      >Add</button>
                    
                    <button
                      className="btn-surface small"
                      onClick={() => togglePlaylist(r.id)}
                      aria-pressed={playlist.includes(r.id)}
                      aria-label={playlist.includes(r.id) ? `Remove ${r.title} from playlist` : `Add ${r.title} to playlist`}
                      >＋PL</button>
                    
                    <button
                      className="btn-surface small"
                      onClick={() => openModal(r)}
                      aria-label={`Open details for ${r.title}`}
                      >Details</button>
                  </div>
                </article>
    )) : (
      <div className="muted-small empty" role="status">No results found.</div>
    )}
            </div>
          </div>
        </section>
        
        <section id="record" className="section surface">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">record</h3>
              <a className="muted-small" href="#record">see all</a>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="list">
              {( (records.filter(r=>r.genre === 'turntable')).length ? records.filter(r=>r.genre === 'turntable') : [
      {id:'rt1', src:"https://picsum.photos/seed/rt1/300/180", title:"Turntable A", price:129},
      {id:'rt2', src:"https://picsum.photos/seed/rt2/300/180", title:"Turntable B", price:199},
      {id:'rt3', src:"https://picsum.photos/seed/rt3/300/180", title:"Turntable C", price:89},
      {id:'rt4', src:"https://picsum.photos/seed/rt4/300/180", title:"Turntable D", price:159}
    ]).slice(0,4).map((t, i) => (
      <div key={t.id || i} className="card" role="listitem" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') {/* optional action */} }}>
        <img src={t.cover || t.src} alt={t.title} />
        <div className="font-semibold text-center" style={{paddingTop:12}}>{t.title}</div>
        <div className="muted-small text-center" style={{paddingBottom:12}}>${(t.price).toFixed(0)}</div>
      </div>
    ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container about-grid">
            <div className="card" style={{ backgroundImage: "url('https://picsum.photos/seed/instore/800/520')", backgroundSize:'cover' }} />
            <div>
              <h3 className="text-2xl font-bold">vinyl.store</h3>
              <p className="muted-small">Our online store is the place where you can find a selection of new and used records—curated with love. We ship worldwide and care about condition and packaging.</p>
            </div>
          </div>
        </section>

        <section id="buyers" className="section surface">
          <div className="container grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold">to buyers</h3>
              <p className="muted-small mb-4">Information about shipping, returns, grading and payment options.</p>
              <ul className="space-y-2 muted-small">
                <li>• safe & insured shipping</li>
                <li>• condition grading explained</li>
                <li>• payment via cards & bank transfer</li>
              </ul>
            </div>
            
            <div>
              <form id="inquiryForm" className="card p-4" onSubmit={(e)=>{ e.preventDefault(); alert('Inquiry sent — integrate /api/inquiry'); e.target.reset(); }}>
                <h4 className="font-semibold mb-3">Order inquiry</h4>
                <input name="name" placeholder="Your name" className="w-full mb-2" />
                <input name="email" placeholder="Email" className="w-full mb-2" />
                <textarea name="message" placeholder="Message" className="w-full mb-2" rows={4}></textarea>
                <div className="flex gap-2">
                  <button type="submit" className="btn-accent">Send</button>
                  <button type="button" id="clearForm" className="btn-surface" onClick={(e)=> e.currentTarget.closest('form').reset()}>Clear</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container subscribe-row">
            <div>
              <h3 className="text-xl font-bold">email</h3>
              <p className="muted-small">Sign up for new arrivals and promotions.</p>
            </div>
            <form className="flex gap-3" onSubmit={(e)=>{ e.preventDefault(); alert('Subscribed — wire to /api/subscribe'); }}>
              <input id="subscribeEmail" type="email" placeholder="your email" className="input-search" required />
              <button className="btn-accent" type="submit">Subscribe</button>
            </form>
          </div>
        </section>

        <footer className="section mt-12 surface">
          <div className="container flex flex-col md:flex-row justify-between items-center py-6">
            <div className="muted-small">vinyl.store@gmail.com • Terms • Privacy • © 2025</div>
            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="#" className="muted-small">Instagram</a>
              <a href="#" className="muted-small">Facebook</a>
              <a href="#" className="muted-small">Twitter</a>
            </div>
          </div>
        </footer>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e)=> e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>Close</button>
            <div className="modal-grid">
              <div className="modal-cover">
                <img src={modal.cover} alt={modal.title} />
                <div className="modal-cover-caption">{modal.title}</div>
              </div>
              <div className="modal-details">
                <h3>{modal.title}</h3>
                <div className="muted-small">{modal.artist} • {modal.year} • {modal.genre}</div>
                <p className="muted-small track-description">Опис треку: тут короткий опис треку — стиль, настрій, цікаві факти про запис або реліз.</p>

                <div className="modal-actions">
                  <button className="btn-accent" onClick={()=> { addToCart(modal.id); closeModal(); }}>Add to cart — ${modal.price.toFixed(2)}</button>
                  <button className="btn-surface" onClick={()=> { togglePlaylist(modal.id); closeModal(); }}>Add to playlist</button>
                </div>

                <div className="preview-block">
                  <div className="muted-small">Preview</div>
                  <audio controls src={modal.samples?.[0] || ""} className="audio-control"/>
                </div>

                <div className="rating-block muted-small">Rating: {modal.rating} ★ — Reviews: {modal.reviews.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {sideContent && <div className="side-panel">{sideContent}</div>}
    </div>
  );
}
