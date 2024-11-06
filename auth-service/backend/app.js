const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config(); // Ensure that .env file is loaded correctly

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend origin
  credentials: true // Allow cookies to be sent with CORS requests
}));
app.use(bodyParser.json()); // Ensure this is used before defining routes
app.use(cookieParser()); // Middleware to parse cookies

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Example route to set cookies
app.post('/set-cookies', (req, res) => {
  const { userId, token } = req.body;

  res.cookie('userId', userId, {
    httpOnly: true, // Cookie accessible uniquement via HTTP
    sameSite: 'None', // Autoriser les cookies avec des requêtes cross-site
    secure: true,    // Cookie uniquement envoyé via HTTPS
    maxAge: 24 * 60 * 60 * 1000 // Expiration du cookie (1 jour)
  });
  res.cookie('authToken', token, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 // Expiration du cookie (1 jour)
  });

  res.status(200).send('Cookies are set');
});

app.listen(5001, () => {
  console.log('Server started on port 5001');
});
