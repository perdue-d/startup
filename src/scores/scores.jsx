
import React from 'react';

export function Scores({ scores, user }) {
  const sortedScores = [...scores].sort(
    (a, b) => b.score - a.score
  );

  return (
    <main className="page-content">
      <h1>Leaderboard</h1>

      <p>The best of the best</p>

      {user && <h2>Current Player: {user}</h2>}

      {sortedScores.length === 0 ? (
        <p>empty for now</p>
      ) : (
        <table className="table table-striped score-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {sortedScores.map((entry, index) => (
              <tr key={entry.id || index}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
                <td>
                  {entry.date
                    ? new Date(entry.date).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
