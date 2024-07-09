// Este archivo contiene el código del servidor backend usando Node.js y Express.

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'angularuser',
  host: 'localhost',
  database: 'ejemplologin',
  password: 'Practica',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

let userTokens = {};

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    const token = 'dummy-token-' + Date.now();
    userTokens[token] = email;
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor al registrar el usuario. Por favor, inténtelo de nuevo más tarde.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = 'dummy-token-' + Date.now();
        userTokens[token] = email;
        res.json({ token, email });
      } else {
        res.status(401).json({ message: 'Credenciales inválidas. Por favor, verifique su email y contraseña.' });
      }
    } else {
      res.status(401).json({ message: 'Usuario no encontrado. Por favor, registre una cuenta primero.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor al iniciar sesión. Por favor, inténtelo de nuevo más tarde.' });
  }
});

app.get('/api/user', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const email = userTokens[token];
  if (email) {
    res.json({ email });
  } else {
    res.status(401).json({ message: 'No autorizado. Por favor, inicie sesión primero.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
