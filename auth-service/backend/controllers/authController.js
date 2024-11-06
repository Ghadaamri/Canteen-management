// authController.js

const db = require('../config/db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insérer l'utilisateur dans la base de données sans hachage du mot de passe
    await db.promise().query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Requête SQL pour récupérer l'utilisateur basé sur l'email
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const user = rows[0];

    // Comparer le mot de passe en texte brut
    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Générer le token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated token:', token); // Vérifiez que le token est généré

    // Envoyer la réponse avec le token et l'ID utilisateur
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      userId: user.id // Incluez l'ID utilisateur dans la réponse
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
