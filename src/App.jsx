import { useState, useEffect } from "react";
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
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("vinyl_cart")||"{}"));
  const [playlist, setPlaylist] = useState(JSON.parse(localStorage.getItem("vinyl_playlist")||"[]"));
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [modalRecord, setModalRecord] = useState(null);

  useEffect(() => { localStorage.setItem("vinyl_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("vinyl_playlist", JSON.stringify(playlist)); }, [playlist]);

  const addToCart = (id, qty=1) => setCart(prev => ({...prev, [id]: (prev[id]||0)+qty}));
  const updateCartQty = (id, qty) => {
    if(qty<=0) { const c={...cart}; delete c[id]; setCart(c); }
    else setCart(prev=>({...prev,[id]:qty}));
  };
  const togglePlaylist = (id) => setPlaylist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);

  const filteredRecords = records.filter(r =>
    (r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.artist.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (genreFilter==="all" || r.genre===genreFilter)
  );
  const genres = ["all", ...Array.from(new Set(DEMO.map(r=>r.genre)))];

  const [sideContent, setSideContent] = useState(null);

  const openModal = (rec) => setModalRecord(rec);
  const closeModal = () => setModalRecord(null);

  const openCartPanel = () => {
    const items = Object.entries(cart).map(([id,qty])=>({rec:records.find(r=>r.id==id),qty}));
    const total = items.reduce((s,it)=>s+(it.rec?.price||0)*it.qty,0);
    setSideContent(
      <div className="rounded-xl shadow p-4 max-w-sm bg-[var(--surface)]">
        <h4 className="font-bold">Cart</h4>
        {items.length ? items.map(it=>(
          <div key={it.rec.id} className="flex items-center gap-3 mt-3">
            <img src={it.rec.cover} className="w-12 h-12 rounded"/>
            <div className="flex-1 text-sm">
              <div>{it.rec.title}</div>
              <div className="muted-small text-xs">{it.qty} × ${it.rec.price.toFixed(2)}</div>
            </div>
            <input type="number" value={it.qty} min="0" onChange={e=>updateCartQty(it.rec.id,Number(e.target.value))} className="w-16 px-2 py-1 rounded bg-[var(--surface)] text-[var(--text)] border-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"/>
          </div>
        )) : <div className="mt-4 muted-small">Cart is empty</div>}
        <div className="mt-4 font-bold">Total: ${total.toFixed(2)}</div>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-2 rounded btn-accent" onClick={()=>alert("Checkout stub")}>Checkout</button>
          <button className="px-3 py-2 rounded surface muted" onClick={()=>setSideContent(null)}>Close</button>
        </div>
      </div>
    );
  };

  const openPlaylistPanel = () => {
    const list = playlist.map(id => records.find(r => r.id===id)).filter(Boolean);
    setSideContent(
      <div className="rounded-xl shadow p-4 max-w-sm bg-[var(--surface)]">
        <h4 className="font-bold">Playlist</h4>
        {list.length ? list.map(r=>(
          <div key={r.id} className="flex items-center gap-3 mt-3">
            <img src={r.cover} className="w-12 h-12 rounded"/>
            <div className="flex-1 text-sm">
              {r.title}
              <div className="muted-small text-xs">{r.artist}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={()=>alert(`Play ${r.title}`)} className="playSample px-2 py-1 rounded surface muted">Play</button>
              <button onClick={()=>{togglePlaylist(r.id)}} className="removePL px-2 py-1 rounded surface muted text-red-400 hover:text-red-600">Remove</button>
            </div>
          </div>
        )) : <div className="mt-4 muted-small">Playlist empty</div>}
        <div className="mt-3 flex gap-2">
          <button onClick={()=>setSideContent(null)} className="px-3 py-2 rounded surface muted">Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="modern">
      <header className="surface topbar">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center display" style={{background:"linear-gradient(90deg,var(--accent),var(--accent-2))", color:"var(--surface)"}}>V</div>
            <div>
              <div className="font-semibold">vinyl.store</div>
              <div className="muted-small">collectors & lovers</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6 muted">
              <a href="#new">New</a><a href="#record">Record</a><a href="#about">About</a><a href="#buyers">Buyers</a>
            </nav>
            <button className="px-3 py-2 rounded surface muted" onClick={openCartPanel}>
              Cart ({Object.values(cart).reduce((s,n)=>s+n,0)})
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="section surface">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="display text-4xl md:text-5xl font-bold mb-3">Record & vinyl market</h1>
              <p className="muted-small mb-6">Expand your vinyl record collection and find the perfect second-hand or new release. Curated selection from vintage to contemporary.</p>
              <div className="flex gap-3">
                <input type="search" placeholder="search the catalog" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="px-4 py-3 rounded w-full md:w-72 bg-[var(--surface)] text-[var(--text)] placeholder:muted-small"/>
                <button className="btn-accent px-4 py-3 rounded">Search</button>
                <button className="px-4 py-3 rounded surface muted" title="Spin preview">Preview</button>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="record" aria-hidden="true"><div className="label">45 RPM</div></div>
            </div>
          </div>
        </section>

        <section id="new" className="section">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">new products</h2>
              <select className="px-3 py-2 rounded surface muted" value={genreFilter} onChange={e=>setGenreFilter(e.target.value)}>
                {genres.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredRecords.length ? filteredRecords.map(r=>(
                <div key={r.id} className="card p-3 text-center fade-in">
                  <div className="mx-auto mb-3">
                    <div className="vinyl-thumb" style={{backgroundImage:`url(${r.cover})`, backgroundSize:"cover", backgroundPosition:"center"}}/>
                  </div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="muted-small">{r.artist} • {r.year}</div>
                  <div className="mt-2 font-bold">${r.price.toFixed(2)}</div>
                  <div className="mt-3 flex justify-center gap-2">
                    <button className="add-btn px-3 py-1 rounded btn-accent" onClick={()=>addToCart(r.id)}>Add</button>
                    <button className="pl-btn px-3 py-1 rounded surface muted" onClick={()=>togglePlaylist(r.id)}>＋PL</button>
                    <button className="view-btn px-3 py-1 rounded surface muted" onClick={()=>openModal(r)}>Details</button>
                  </div>
                </div>
              )) : <div className="mt-6 muted-small text-center">No results found.</div>}
            </div>
          </div>
        </section>

        <section id="about" className="section surface mt-12">
          <div className="container grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Vinyl.Store</h2>
              <p className="muted-small mb-3">Vinyl.Store is a curated marketplace for collectors and music lovers. We provide new and second-hand records from all decades, with authentic reviews and ratings.</p>
              <p className="muted-small">Our mission is to keep vinyl culture alive and make music collecting accessible to everyone.</p>
            </div>
            <div className="flex justify-center">
              <img src="https://picsum.photos/seed/about/400/400" className="rounded-xl shadow-xl"/>
            </div>
          </div>
        </section>

        <section id="buyers" className="section mt-12">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Happy Buyers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i=>(
                <div key={i} className="rounded-xl shadow p-4 bg-[var(--surface)] flex flex-col items-center gap-2">
                  <img src={`https://picsum.photos/seed/buyer${i}/80`} className="w-20 h-20 rounded-full"/>
                  <div className="font-semibold">Buyer {i}</div>
                  <div className="muted-small text-sm">"Great selection and fast delivery!"</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section surface mt-12">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Newsletter</h2>
            <p className="muted-small mb-6">Get updates about new arrivals and exclusive offers.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <input type="email" placeholder="Your email" className="px-4 py-3 rounded w-64 md:w-72 bg-[var(--surface)] text-[var(--text)] placeholder:muted-small"/>
              <button className="btn-accent px-6 py-3 rounded">Subscribe</button>
            </div>
          </div>
        </section>
        
        <footer className="section mt-12 surface">
          <div className="container flex flex-col md:flex-row justify-between items-center py-6">
            <div className="muted-small">&copy; 2025 Vinyl.Store</div>
            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="#" className="muted-small hover:accent">Instagram</a>
              <a href="#" className="muted-small hover:accent">Facebook</a>
              <a href="#" className="muted-small hover:accent">Twitter</a>
            </div>
          </div>
        </footer>
      </main>

      {modalRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="rounded-xl max-w-2xl w-full p-6 bg-[var(--surface)]" onClick={e=>e.stopPropagation()}>
            <button onClick={closeModal} className="ml-auto block mb-4">Close</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="md:col-span-1 flex justify-center">
                <div className="relative w-full max-w-xs rounded-xl overflow-hidden shadow-xl">
                  <img src={modalRecord.cover} className="w-full h-full object-cover" alt="cover"/>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 text-white font-semibold text-center">{modalRecord.title}</div>
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{modalRecord.title}</h3>
                  <p className="muted-small mb-3">{modalRecord.artist} • {modalRecord.year} • {modalRecord.genre}</p>
                  <p className="muted-small mb-4">Опис реліза — стан платівки, notes, label info.</p>
                </div>
                <div className="flex gap-3 mb-4">
                  <button className="px-4 py-2 rounded-lg btn-accent transition hover:brightness-110" onClick={()=>{addToCart(modalRecord.id); closeModal();}}>Add to cart — ${modalRecord.price.toFixed(2)}</button>
                  <button className="px-4 py-2 rounded-lg surface muted transition hover:bg-[var(--accent)] hover:text-[var(--surface)]" onClick={()=>{togglePlaylist(modalRecord.id); closeModal();}}>Add to playlist</button>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-semibold muted-small mb-2">Preview</div>
                  <div className="rounded-xl shadow-lg p-3 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-2)]/10 flex items-center">
                    <audio controls src={modalRecord.samples[0]||''} className="w-full rounded-lg bg-[var(--surface)]" style={{accentColor:"var(--accent)",outline:"none"}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {sideContent && (
        <div className="fixed right-6 bottom-6 z-50">{sideContent}</div>
      )}
    </div>
  );
}
