// moch-server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const SECRET = 'shh-its-a-secret';

server.use(middlewares);
server.use(bodyParser.json());

//Rota para login customizada
server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const db = router.db; // lowdb instance
  const user = db.get('users').find({ email, senha }).value();

    if (user) {
    const token = jwt.sign({ id: user.id, email: user.email }
  }
