const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));

const users = {};
let nextUserId = 1;
app.post('/api/users', (req, res) => {
  console.log('Sign Up', req.body);
  users[nextUserId++] = req.body;
  return res.send(req.body);
});

const tokens = {};
app.post('/api/auth/logIn', (req, res) => {
  console.log('Log In', req.body);
  const { email, password } = req.body;
  const user = Object.entries(users).find(([, u]) => u.email === email && u.password === password);
  if (user) {
    const [userId] = user;
    const token = (new Date()).getTime().toString();
    tokens[token] = userId;
    return res.send({ token: token });
  }
  return res.status(400).end();
});

function getAuthorizedUser(req) {
  const header = req.get('Authorization');
  const token = header ? header.replace('Token ', '') : null;
  console.log({
    tokenKey: token,
    userId: tokens[token],
    user: users[tokens[token]]
  });
  return users[tokens[token]];
}

app.get('/api/users/me', (req, res) => {
  console.log('me', req.get('Authorization'));
  const me = getAuthorizedUser(req);
  return me ? res.send(me) : res.status(401).end();
});

function getFullData(storage) {
  return Object.entries(storage).map(([id, data]) => ({ ...data, id: +id }));
}

const chats = {};
let nextChatId = 1;
app.get('/api/chats', (req, res) => {
  console.log('chats');
  const currUser = getAuthorizedUser(req);
  return currUser ? res.send(getFullData(chats)) : res.status(401).end();
});

const messages = {};
let nextMessageId = 1;
app.get('/api/messages', (req, res) => {
  console.log('messages');
  const currUser = getAuthorizedUser(req);
  return currUser ? res.send(getFullData(messages)) : res.status(401).end();
});

app.get('/api/users', (req, res) => {
  console.log('users');
  const currUser = getAuthorizedUser(req);
  return currUser ? res.send(getFullData(users)) : res.status(401).end();
})

app.post('/api/dump', (req, res) => {
  console.log(req.body.slice(0, 15));
  const messageKeys = req.body.map(({ topic, author: { username }, chatName, text, sentAt }) => {
    chats[nextChatId++] = { name: chatName };
    users[nextUserId++] = { username, email: `${username}@gmail.com`, password: `${username}--123-pwd` };
    messages[nextMessageId] = { topic, text, chatId: nextChatId, authorId: nextUserId, sentAt };
    return nextMessageId++;
  });
  return res.send(messageKeys);
});

app.get('/', (_, res) => {
  res.status(200).end();
})

app.listen(8000, () => console.log('Sample app backend listening'));
