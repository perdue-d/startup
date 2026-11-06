
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
  const [user, setUser] = useState('');
  const [scores, setScores] = useState([]);

  async function refreshScores() {
    try {
      const response = await fetch('/api/scores');
      if (!response.ok) {
        throw new Error('Could not load scores.');
      }
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Not logged in.');
        }
        return response.json();
      })
      .then((data) => setUser(data.username))
      .catch(() => setUser(''));

    refreshScores();
  }, []);

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
                <NavLink to="/play">Begin</NavLink>
              </li>
              <li>
                <NavLink to="/scores">Compare Yourselves</NavLink>
              </li>
              <li>
                <NavLink to="/about">Information</NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Login user={user} setUser={setUser} />
            }
          />

          <Route
            path="/play"
            element={
              <Play user={user} refreshScores={refreshScores} />
            }
          />

          <Route
            path="/scores"
            element={
              <Scores
                scores={scores}
                user={user}
                refreshScores={refreshScores}
              />
            }
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
