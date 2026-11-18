
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const path = require('node:path');
const DB = require('./database.js');

const app = express();
const port = Number(process.env.PORT || 4000);
const cookieName = 'authToken';

app.set('trust proxy', 'loopback');
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

function setCookie(req, res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: req.secure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

async function findUser(req) {
  const token = req.cookies[cookieName];

  if (!token) {
    return null;
  }

  return DB.getUserByToken(token);
}

async function requireAuth(req, res, next) {
  try {
    const user = await findUser(req);

    if (!user) {
      return res.status(401).json({
        msg: 'You must log in first.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

app.post('/api/auth/create', async (req, res, next) => {
  try {
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
        msg: 'Enter a username and password of at least 8 characters.'
      });
    }

    const name = username.trim();

    if (await DB.getUser(name)) {
      return res.status(409).json({
        msg: 'Username already exists.'
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const token = crypto.randomUUID();

    await DB.createUser({
      username: name,
      password: hash,
      token
    });

    setCookie(req, res, token);

    res.status(201).json({ username: name });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        msg: 'Username already exists.'
      });
    }

    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(401).json({
        msg: 'Incorrect username or password.'
      });
    }

    const user = await DB.getUser(username.trim());

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        msg: 'Incorrect username or password.'
      });
    }

    const token = crypto.randomUUID();

    await DB.updateToken(user.username, token);
    setCookie(req, res, token);

    res.json({ username: user.username });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/auth/logout', async (req, res, next) => {
  try {
    const token = req.cookies[cookieName];

    if (token) {
      await DB.removeToken(token);
    }

    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'lax',
      path: '/'
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username });
});

app.get('/api/scores', async (req, res, next) => {
  try {
    const scores = await DB.getScores();

    res.json(scores.map((entry) => ({
      id: entry.id,
      name: entry.name,
      score: entry.score,
      date: entry.date
    })));
  } catch (error) {
    next(error);
  }
});

app.post('/api/score', requireAuth, async (req, res, next) => {
  try {
    const { score } = req.body || {};

    if (
      !Number.isSafeInteger(score) ||
      score < 0 ||
      score > 100000
    ) {
      return res.status(400).json({
        msg: 'Invalid score.'
      });
    }

    const entry = {
      id: crypto.randomUUID(),
      name: req.user.username,
      score,
      date: new Date().toISOString()
    };

    await DB.addScore(entry);

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({
    msg: 'API endpoint not found.'
  });
});

const publicFolder = path.join(__dirname, 'public');

app.use(express.static(publicFolder));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(publicFolder, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    msg: 'Server error.'
  });
});

DB.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Startup service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
