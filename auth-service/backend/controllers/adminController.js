// authController.js

const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('Received request body:', req.body); // Add this line for debugging
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

    if (rows.length > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Insérer l'admin dans la base de données sans hachage du mot de passe
    await db.promise().query('INSERT INTO admins (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password]);

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Admin does not exist' });
    }

    const admin = rows[0];

    // Assuming password is stored as plain text
    if (password !== admin.password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      adminId: admin.id  // Return adminId instead of userId
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
