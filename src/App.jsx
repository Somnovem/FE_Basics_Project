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

  useEffect(() => {
    localStorage.setItem("vinyl_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("vinyl_playlist", JSON.stringify(playlist));
  }, [playlist]);

  const addToCart = (id, qty=1) => {
    setCart(prev => ({...prev, [id]: (prev[id]||0)+qty}));
  }

  const togglePlaylist = (id) => {
    setPlaylist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  }

  const filteredRecords = records.filter(r =>
    (r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.artist.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (genreFilter==="all" || r.genre===genreFilter)
  );

  const genres = ["all", ...Array.from(new Set(DEMO.map(r=>r.genre)))];

  return (
    <div className="modern">
      <Header cartCount={Object.values(cart).reduce((s,n)=>s+n,0)} />
      <main>
        <Hero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          genres={genres}
          filteredRecords={filteredRecords}
        />
        <Catalog
          records={filteredRecords}
          addToCart={addToCart}
          togglePlaylist={togglePlaylist}
          openModal={setModalRecord}
        />
        <RecordSection />
        <About />
        <Buyers addToCart={addToCart} togglePlaylist={togglePlaylist}/>
        <Subscribe />
        <Footer />
      </main>

      {modalRecord && <Modal record={modalRecord} closeModal={()=>setModalRecord(null)} addToCart={addToCart} togglePlaylist={togglePlaylist} />}
    </div>
  );
}

/* =================== Components =================== */

function Header({cartCount}) {
  return (
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
          <button className="px-3 py-2 rounded surface muted">Cart ({cartCount})</button>
        </div>
      </div>
    </header>
  );
}

function Hero({searchTerm,setSearchTerm,genreFilter,setGenreFilter,genres,filteredRecords}) {
  return (
    <section className="section surface">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="display text-4xl md:text-5xl font-bold mb-3">Record & vinyl market</h1>
          <p className="muted-small mb-6">Expand your vinyl record collection and find the perfect second-hand or new release. Curated selection from vintage to contemporary.</p>
          <div className="flex gap-3">
            <input type="search" placeholder="search the catalog"
              value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
              className="px-4 py-3 rounded w-full md:w-72 bg-[var(--surface)] text-[var(--text)] placeholder:muted-small" />
            <button className="btn-accent px-4 py-3 rounded">Search</button>
            <button className="px-4 py-3 rounded surface muted" title="Spin preview">Preview</button>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="record" aria-hidden="true"><div className="label">45 RPM</div></div>
        </div>
      </div>
    </section>
  );
}

function Catalog({records,addToCart,togglePlaylist,openModal}) {
  if(!records.length) return <div className="mt-6 muted-small text-center">No results found.</div>;
  return (
    <section id="new" className="section">
      <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {records.map(r=>(
          <div key={r.id} className="card p-3 text-center fade-in">
            <div className="mx-auto mb-3">
              <div className="vinyl-thumb" style={{backgroundImage:`url(${r.cover})`, backgroundSize:"cover", backgroundPosition:"center"}} />
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
        ))}
      </div>
    </section>
  );
}

function RecordSection() {
  return (
    <section id="record" className="section surface">
      <div className="container grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 flex flex-col items-center text-center"><img src="https://picsum.photos/seed/rt1/300/180" className="w-full rounded mb-3" alt="player"/><div className="font-semibold">Turntable A</div><div className="muted-small">$129</div></div>
        <div className="card p-4 flex flex-col items-center text-center"><img src="https://picsum.photos/seed/rt2/300/180" className="w-full rounded mb-3" alt="player"/><div className="font-semibold">Turntable B</div><div className="muted-small">$199</div></div>
        <div className="card p-4 flex flex-col items-center text-center"><img src="https://picsum.photos/seed/rt3/300/180" className="w-full rounded mb-3" alt="player"/><div className="font-semibold">Turntable C</div><div className="muted-small">$89</div></div>
        <div className="card p-4 flex flex-col items-center text-center"><img src="https://picsum.photos/seed/rt4/300/180" className="w-full rounded mb-3" alt="player"/><div className="font-semibold">Turntable D</div><div className="muted-small">$159</div></div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section">
      <div className="container grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 card p-4">
          <img src="https://picsum.photos/seed/instore/400/260" className="w-full rounded mb-3" alt="store"/>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold">vinyl.store</h3>
          <p className="muted-small">Our online store is the place where you can find a selection of new and used records—curated with love. We ship worldwide and care about condition and packaging.</p>
        </div>
      </div>
    </section>
  );
}

function Buyers({addToCart,togglePlaylist}) {
  return (
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
          <form className="card p-4">
            <h4 className="font-semibold mb-3">Order inquiry</h4>
            <input name="name" placeholder="Your name" className="w-full mb-2 px-3 py-2 rounded" />
            <input name="email" placeholder="Email" className="w-full mb-2 px-3 py-2 rounded" />
            <textarea name="message" placeholder="Message" className="w-full mb-2 px-3 py-2 rounded"></textarea>
            <div className="flex gap-2">
              <button type="submit" className="btn-accent px-4 py-2 rounded">Send</button>
              <button type="button" className="px-4 py-2 rounded surface">Clear</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Subscribe() {
  return (
    <section className="section">
      <div className="container grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-xl font-bold">email</h3>
          <p className="muted-small">Sign up for new arrivals and promotions.</p>
        </div>
        <form className="flex gap-3">
          <input type="email" placeholder="your email" className="px-4 py-3 rounded w-full" />
          <button className="btn-accent px-4 py-3 rounded">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="section surface">
      <div className="container text-center muted-small">vinyl.store@gmail.com • Terms • Privacy • © 2025</div>
    </footer>
  );
}

function Modal({record,closeModal,addToCart,togglePlaylist}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="rounded-xl max-w-2xl w-full p-6 bg-[var(--surface)]">
        <button onClick={closeModal} className="ml-auto block mb-4">Close</button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-full max-w-xs rounded-xl overflow-hidden shadow-xl">
              <img src={record.cover} className="w-full h-full object-cover" alt="cover"/>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 text-white font-semibold text-center">{record.title}</div>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">{record.title}</h3>
              <p className="muted-small mb-3">{record.artist} • {record.year} • {record.genre}</p>
              <p className="muted-small mb-4">Опис реліза — стан платівки, notes, label info.</p>
            </div>
            <div className="flex gap-3 mb-4">
              <button onClick={()=>{addToCart(record.id); closeModal();}} className="px-4 py-2 rounded-lg btn-accent">Add to cart — ${record.price.toFixed(2)}</button>
              <button onClick={()=>{togglePlaylist(record.id); closeModal();}} className="px-4 py-2 rounded-lg surface muted">Add to playlist</button>
            </div>
            {record.samples && record.samples[0] && <audio controls src={record.samples[0]} className="w-full rounded-lg bg-[var(--surface)] my-2" style={{accentColor:"var(--accent)"}} />}
          </div>
        </div>
      </div>
    </div>
  );
}
