
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({ user, setUser }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function login(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setUser(name.trim());
    setError('');
    navigate('/play');
  }

  function logout() {
    setUser('');
    setName('');
  }

  return (
    <main className="page-content">
      <h1>Test Yourself</h1>

      {user ? (
        <div className="label-column">
          <h2>Welcome, {user}!</h2>
          <p>You are ready to play.</p>

          <div className="button-row">
            <button
              className="my-button"
              onClick={() => navigate('/play')}
            >
              Play Game
            </button>

            <button className="my-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <form className="label-column" onSubmit={login}>
          <label htmlFor="username">Name</label>

          <input
            id="username"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name here"
            maxLength={30}
          />

          {error && <p role="alert">{error}</p>}

          <p>
            Enter a name to start playing.
            Login is mocked for this assignment.
          </p>

          <button className="my-button" type="submit">
            Login / Create Account
          </button>
        </form>
      )}
    </main>
  );
}
