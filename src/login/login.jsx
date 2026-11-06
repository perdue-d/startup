
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({ user, setUser }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function authenticate(event, action) {
    event.preventDefault();
    setError('');

    if (!name.trim() || password.length < 8) {
      setError('Enter a username and password of at least 8 characters.');
      return;
    }

    try {
      const response = await fetch(`/api/auth/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: name.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Authentication failed.');
      }

      setUser(data.username);
      setPassword('');
      navigate('/play');
    } catch (error) {
      setError(error.message);
    }
  }

  async function logout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Could not log out.');
      }

      setUser('');
      setName('');
      setPassword('');
      setError('');
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
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

            <button
              className="my-button"
              onClick={logout}
            >
              Logout
            </button>
          </div>

          {error && <p role="alert">{error}</p>}
        </div>
      ) : (
        <form
          className="label-column"
          onSubmit={(event) => authenticate(event, 'login')}
        >
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter username"
            maxLength={30}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            minLength={8}
            autoComplete="current-password"
            required
          />

          {error && <p role="alert">{error}</p>}

          <div className="button-row">
            <button
              className="my-button"
              type="submit"
            >
              Login
            </button>

            <button
              className="my-button"
              type="button"
              onClick={(event) => authenticate(event, 'create')}
            >
              Create Account
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
