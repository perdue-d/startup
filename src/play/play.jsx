
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Play({ user, setScores }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState('ready');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [endTime, setEndTime] = useState(null);

  function randomPosition() {
    setPosition({
      x: 10 + Math.random() * 80,
      y: 12 + Math.random() * 76,
    });
  }

  function startGame() {
    setScore(0);
    setTimeLeft(60);
    randomPosition();
    setEndTime(Date.now() + 60000);
    setStatus('playing');
  }

  function clickTarget() {
    if (status !== 'playing' || Date.now() >= endTime) {
      return;
    }

    setScore((previous) => previous + 1);
    randomPosition();
  }

  // Update the countdown during the game.
  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setTimeLeft(remaining);
    }, 100);

    return () => clearInterval(timer);
  }, [status, endTime]);

  // Finish the game and save the final score.
  useEffect(() => {
    if (status !== 'playing' || timeLeft > 0) {
      return;
    }

    setScores((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: user,
        score: score,
        date: new Date().toISOString(),
      },
    ]);

    setStatus('finished');
  }, [timeLeft, status, score, user, setScores]);

  if (!user) {
    return (
      <main className="page-content">
        <h1>Reaction Time Game</h1>
        <p>Please log in before playing.</p>
        <Link className="my-button" to="/">
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="page-content">
      <h1>Reaction Time Game</h1>

      <h2> {user}</h2>
      <h2>Time Remaining {timeLeft}</h2>
      <h2> {score}</h2>

      {status === 'ready' && (
        <div>
          <p>
            Press as fast as you can
          </p>

          <button className="my-button" onClick={startGame}>
            Begin
          </button>
        </div>
      )}

      {status === 'playing' && (
        <div className="game-area">
          <button
            className="game-target"
            onClick={clickTarget}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            aria-label="Click reaction target"
          >
            CLICK!
          </button>
        </div>
      )}

      {status === 'finished' && (
        <div>
          <h2>Your Done</h2>
          <h2>Final Score: {score}</h2>
          <p>This will be Remembered.</p>

          <div className="button-row">
            <button className="my-button" onClick={startGame}>
              Play Again
            </button>

            <Link className="my-button" to="/scores">
              View Leaderboard
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
