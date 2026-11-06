
import React, { useEffect, useState } from 'react';

export function About() {
  const [github, setGithub] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://api.github.com/repos/perdue-d/startup')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load GitHub data.');
        }
        return response.json();
      })
      .then((data) => setGithub(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <main className="page-content">
      <h1>About Reaction Time</h1>

      <p>
        Test your reaction time against other players!
        You have 60 seconds to click the moving button
        as many times as possible.
      </p>

      <h2>How to Play</h2>

      <p>1. Create an account or log in.</p>
      <p>2. Go to the game page.</p>
      <p>3. Click Begin.</p>
      <p>4. Click the target as many times as possible.</p>
      <p>5. View your score on the leaderboard.</p>

      <h2>About the Project</h2>

      <p>
        Created for BYU CS 260.
      </p>

      <p>
        This application uses React, Vite, Node.js,
        Express, BCrypt, and the GitHub API.
      </p>

      <h2>GitHub API Information</h2>

      {github ? (
        <div>
          <p>Repository: {github.full_name}</p>
          <p>Stars: {github.stargazers_count}</p>
          <p>Forks: {github.forks_count}</p>
        </div>
      ) : (
        <p>{error || 'Loading GitHub data...'}</p>
      )}

      <a
        href="https://github.com/perdue-d/startup"
        target="_blank"
        rel="noreferrer"
      >
        View Source Code on GitHub
      </a>
    </main>
  );
}
