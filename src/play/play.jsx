
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function Play({ user, refreshScores }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState('ready');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const saved = useRef(false);

  function moveButton() {
    setPosition({
      x: 8 + Math.random() * 84,
      y: 10 + Math.random() * 80,
    });
  }

  function startGame() {
    saved.current = false;

    setScore(0);
    setTimeLeft(60);
    setError('');
    setSaveMessage('');

    moveButton();

    setEndTime(Date.now() + 60000);
    setStatus('playing');
  }

  function clickButton() {
    if (status !== 'playing') {
      return;
    }

    if (Date.now() >= endTime) {
      return;
    }

    setScore((previous) => previous + 1);

    // MOVE THE BUTTON EVERY TIME IT IS CLICKED
    moveButton();
  }

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

  useEffect(() => {
    if (
      status !== 'playing' ||
      timeLeft > 0 ||
      saved.current
    ) {
      return;
    }

    saved.current = true;
    setStatus('finished');

    async function saveScore() {
      try {
        const response = await fetch('/api/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ score }),
        });

        if (!response.ok) {
          throw new Error('Could not save your score.');
        }

        await refreshScores();

        setSaveMessage('Your score was saved!');
      } catch (error) {
        setError(error.message);
      }
    }

    saveScore();
  }, [status, timeLeft, score, refreshScores]);

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

      <h2>Player: {user}</h2>

      <h2>Time Remaining: {timeLeft}</h2>

      <h2>Score: {score}</h2>

      {status === 'ready' && (
        <div>
          <p>Click the button as many times as you can!</p>

          <button
            className="my-button"
            onClick={startGame}
          >
            Begin
          </button>
        </div>
      )}

      {status === 'playing' && (
        <div
          className="game-area"
          style={{
            position: 'relative',
            width: '100%',
            height: '450px',
            overflow: 'hidden',
            border: '3px solid black',
            backgroundColor: '#f5f5f5',
          }}
        >
          <button
            className="game-target"
            onClick={clickButton}
            style={{
              position: 'absolute',
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'red',
              color: 'white',
              padding: '15px 25px',
              border: '2px solid black',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            CLICK!
          </button>
        </div>
      )}

      {status === 'finished' && (
        <div>
          <h2>Time's Up!</h2>

          <h2>Final Score: {score}</h2>

          {saveMessage && <p>{saveMessage}</p>}

          {error && <p role="alert">{error}</p>}

          <div className="button-row">
            <button
              className="my-button"
              onClick={startGame}
            >
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
