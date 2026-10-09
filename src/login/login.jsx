import React from 'react';

export function Login() {
  return (
    <main className="page-content">
      <h1>Test Yourself</h1>

      <div className="label-column">
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          placeholder="Enter name here"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
        />

        <div className="button-row">
          <button className="my-button" type="button">
            Create Account
          </button>

          <button className="my-button" type="button">
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
