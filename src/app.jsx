import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom';

import { Login } from './login/login.jsx';
import { Play } from './play/play.jsx';
import { Scores } from './scores/scores.jsx';
import { About } from './about/about.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <h1 className="my-title">Reaction Time</h1>

          <nav>
            <menu className="nav-list">
              <li>
                <NavLink to="/">Home Page</NavLink>
              </li>

              <li>
                <NavLink to="/play">Start the Game</NavLink>
              </li>

              <li>
                <NavLink to="/scores">Compare your scores</NavLink>
              </li>

              <li>
                <NavLink to="/about">Learn more</NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/play" element={<Play />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="main-footer">
          <span>Devin Perdue</span>

          <a
            href="https://github.com/perdue-d/startup"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="page-content">
      <h2>404</h2>
      <p>Page not found.</p>
    </main>
  );
}
