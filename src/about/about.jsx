import React from 'react';

import React from 'react';

export function About() {
  return (
    <main className="page-content">
      <h1>About Reaction Time</h1>

      <p>
        It's simple. login press the buttons and after 
        60 seconds you recieve your score
      </p>

      <h2>How to Play</h2>

      <p>1. Enter your username on the home page.</p>
      <p>2. Navigate to the game page.</p>
      <p>3. Click Start Game.</p>
      <p>4. Click the target as many times as possible.</p>
      <p>5. Check your final score on the leaderboard.</p>

      <h2>About the Project</h2>

      <p>
        Created by Devin Perdue for BYU CS 260
      </p>

      <p>
        This application uses React, JavaScript,
        React Router, and localStorage.
      </p>

      <p>
        Authentication and leaderboard storage
        are currently mocked. A future version
        will use backend services.
      </p>

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
