import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <main className="container">
      <h1>FE Basics — Лабораторні</h1>
      <p className="lead">Ласкаво просимо! Це майбутня лендінг-сторінка.</p>

      <Link className="card" to="/about">
        <strong>Про нас</strong>
        <small>Дізнайтесь більше про авторів</small>
      </Link>

      <footer>© 2025 FE Basics Project</footer>
    </main>
  );
}

export default App;
