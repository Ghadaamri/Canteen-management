const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Make sure to import cors
const app = express();

// Import des routes
const dailySpecialsRoute = require('./routes/dailySpecialsRoute');
const categoriesRoute = require('./routes/categoriesRoute');
const daysRoute = require('./routes/dayRoute');
const reservationRoutes = require('./routes/reservationRoutes');
const sandwichChoiceRoutes = require('./routes/sandwichChoiceRoutes');
const dishComponentRoutes = require('./routes/dishComponentRoutes');
const userRoute = require('./routes/userRoute');

// Import du middleware
const mainMiddleware = require('./middleware/auth');

// Appliquer le middleware CORS
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175','http://localhost:5173'], // Liste des URLs autorisées
  credentials: true // Autorise les cookies, headers d'autorisation, etc.
}));

// Middleware global
app.use(mainMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Définir les routes
app.use('/api/dailySpecials', dailySpecialsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/days', daysRoute);
app.use('/api/reservations', reservationRoutes);
app.use('/api/sandwichChoices', sandwichChoiceRoutes);
app.use('/api/dishComponents', dishComponentRoutes);
app.use('/api/user', userRoute);

// Démarrer le serveur
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
