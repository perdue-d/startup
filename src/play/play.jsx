import React from 'react';

export function Play() {
  return (
    <main className="page-content">
      <h1>Reaction Time Game</h1>

      <p>
        Gameplay will be here where you press buttons until the timer runs out.
      </p>

      <div className="button-row">
        <button className="my-button" type="button">
          Press Me
        </button>

        <button className="my-button" type="button">
          Press Me
        </button>

        <button className="my-button" type="button">
          Press Me
        </button>
      </div>

      <div className="placeholder">
        <img
          src="https://placehold.co/400x300"
          alt="Placeholder"
        />
      </div>
    </main>
  );
}
