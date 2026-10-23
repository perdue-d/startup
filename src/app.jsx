
import React, { useEffect, useState } from 'react';
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
  const [user, setUser] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  const [scores, setScores] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('scores') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('userName', user);
    } else {
      localStorage.removeItem('userName');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <h1 className="my-title">Reaction Time</h1>

          <nav>
            <menu className="nav-list">
              <li><NavLink to="/">Home Page</NavLink></li>
              <li><NavLink to="/play">Start the Game</NavLink></li>
              <li><NavLink to="/scores">Compare your scores</NavLink></li>
              <li><NavLink to="/about">Learn more</NavLink></li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={<Login user={user} setUser={setUser} />}
          />

          <Route
            path="/play"
            element={<Play user={user} setScores={setScores} />}
          />

          <Route
            path="/scores"
            element={<Scores scores={scores} user={user} />}
          />

          <Route path="/about" element={<About />} />

          <Route
            path="*"
            element={
              <main className="page-content">
                <h2>404 - Page Not Found</h2>
              </main>
            }
          />
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
