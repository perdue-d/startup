
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const username = encodeURIComponent(config.userName);
const password = encodeURIComponent(config.password);

const url = `mongodb+srv://${username}:${password}@${config.hostname}`;

const client = new MongoClient(url);
const database = client.db('reactiontime');

const users = database.collection('users');
const scores = database.collection('scores');

async function connect() {
  await client.connect();
  await database.command({ ping: 1 });
  await users.createIndex({ username: 1 }, { unique: true });
  console.log('Connected to MongoDB');
}

async function getUser(username) {
  return users.findOne({ username });
}

async function getUserByToken(token) {
  return users.findOne({ token });
}

async function createUser(user) {
  return users.insertOne(user);
}

async function updateToken(username, token) {
  return users.updateOne(
    { username },
    { $set: { token } }
  );
}

async function removeToken(token) {
  return users.updateOne(
    { token },
    { $unset: { token: '' } }
  );
}

async function addScore(score) {
  return scores.insertOne(score);
}

async function getScores() {
  return scores.find({})
    .sort({ score: -1, date: 1 })
    .limit(100)
    .toArray();
}

module.exports = {
  connect,
  getUser,
  getUserByToken,
  createUser,
  updateToken,
  removeToken,
  addScore,
  getScores
};
