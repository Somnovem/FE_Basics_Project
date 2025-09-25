import "./About.css";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="about-container">
      <header className="page-header">
        <h1>Про авторів</h1>
        <p className="subtitle">Сторінка про студентів, які працювали над проєктом</p>
      </header>

      <section className="profiles">
        <div className="profile-card">
          <h2>Жмура Артем Анатолійович</h2>
          <p>Народився 3 серпня 2006 року в Миколаєві, Україна.</p>
          <p>Закінчив Миколаївський муніципальний колегіум, зараз навчаюсь 3 курс 123 спеціальність в КПІ на ФІОТ</p>

          <h3>Мої хобі:</h3>
          <ul>
            <li>Програмування</li>
            <li>Гра на гітарі</li>
            <li>Подорожі та фотографія</li>
          </ul>

          <h3>Улюблені книги/фільми:</h3>
          <ol>
            <li>«Хроніки Буресвітла» — Брендон Сандерсон</li>
            <li>«Interstellar» — реж. Крістофер Нолан</li>
            <li>«Три товариші» — Е.М. Ремарк</li>
          </ol>

          <p>
            Моє улюблене місто — Київ. Воно має унікальну атмосферу старого європейського міста, дуже глибоку історію,
            вузькі вулички, живу атмосферу та багато історичних пам'яток.
          </p>
          <a href="https://the-city.kiev.ua" target="_blank" rel="noopener noreferrer">
            <img
              src="https://royaldesign.ua/file/495/cc/t9/Rx/1.BNb2.jpg"
              alt="Батьківщина Мати, Київ"
              className="city-photo"
            />
          </a>
        </div>

        <div className="profile-card">
          <h2>Сахно Маргарита Юріївна</h2>
          <p>Placeholder</p>
          <p>Placeholder</p>

          <h3>Мої хобі:</h3>
          <ul>
            <li>Placeholder</li>
            <li>Placeholder</li>
            <li>Placeholder</li>
          </ul>

          <h3>Улюблені книги/фільми:</h3>
          <ol>
            <li>Placeholder</li>
            <li>Placeholder</li>
            <li>Placeholder</li>
          </ol>

          <p>
            Моє улюблене місто — Placeholder.
          </p>
          <a href="https://the-city.kiev.ua" target="_blank" rel="noopener noreferrer">
            <img
              src="https://royaldesign.ua/file/495/cc/t9/Rx/1.BNb2.jpg"
              alt="Батьківщина Мати, Київ"
              className="city-photo"
            />
          </a>
        </div>
      </section>
      <Link className="back-link" to="..">
          ← Назад
      </Link>
      <footer>© 2025 FE Basics Project</footer>
    </main>
  );
}
