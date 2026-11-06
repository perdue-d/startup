
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const app = express();
const port = process.argv.length > 2 ? Number(process.argv[2]) : 4000;

app.set('trust proxy', 'loopback');
app.use(express.json());
app.use(cookieParser());

const users = [];
const scores = [];
const cookieName = 'authToken';

function setCookie(req, res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: req.secure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function findUser(req) {
  const token = req.cookies[cookieName];

  if (!token) {
    return null;
  }

  return users.find((user) => user.token === token) || null;
}

function requireAuth(req, res, next) {
  const user = findUser(req);

  if (!user) {
    return res.status(401).json({
      msg: 'You must log in first.',
    });
  }

  req.user = user;
  next();
}

// Create account
app.post('/api/auth/create', async (req, res) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== 'string' ||
    !username.trim() ||
    username.trim().length > 30 ||
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      msg: 'Enter a username and password (8 or more characters).',
    });
  }

  const name = username.trim();

  if (users.some((user) => user.username === name)) {
    return res.status(409).json({
      msg: 'Username already exists.',
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const token = uuid();

    users.push({
      username: name,
      password: hash,
      token,
    });

    setCookie(req, res, token);

    res.status(201).json({
      username: name,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Could not create account.',
    });
  }
});

// Log in
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};

  const user = users.find(
    (entry) => entry.username === username
  );

  if (!user || typeof password !== 'string') {
    return res.status(401).json({
      msg: 'Incorrect username or password.',
    });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({
      msg: 'Incorrect username or password.',
    });
  }

  user.token = uuid();
  setCookie(req, res, user.token);

  res.json({
    username: user.username,
  });
});

// Log out
app.delete('/api/auth/logout', (req, res) => {
  const user = findUser(req);

  if (user) {
    user.token = null;
  }

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: req.secure,
    sameSite: 'lax',
  });

  res.status(204).end();
});

// Get currently logged-in user
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    username: req.user.username,
  });
});

// Get leaderboard
app.get('/api/scores', (req, res) => {
  res.json(scores);
});

// Submit score - authentication required
app.post('/api/score', requireAuth, (req, res) => {
  const { score } = req.body || {};

  if (!Number.isInteger(score) || score < 0 || score > 100000) {
    return res.status(400).json({
      msg: 'Invalid score.',
    });
  }

  const entry = {
    id: uuid(),
    name: req.user.username,
    score,
    date: new Date().toISOString(),
  };

  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);

  if (scores.length > 100) {
    scores.length = 100;
  }

  res.status(201).json(entry);
});

// Return JSON for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    msg: 'API endpoint not found.',
  });
});

// Serve React frontend
app.use(express.static('public'));

// Support React Router on page refresh
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', {
    root: 'public',
  });
});

app.listen(port, () => {
  console.log(`Startup service running on port ${port}`);
});
