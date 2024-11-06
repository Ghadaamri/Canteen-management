const mysql = require('mysql2');
require('dotenv').config();

console.log('DB_HOST:', process.env.DATABASE_HOST);
console.log('DB_USER:', process.env.DATABASE_USER);
console.log('DB_PASSWORD:', process.env.DATABASE_PASSWORD ? '****' : '');
console.log('DB_NAME:', process.env.DATABASE_NAME);

// Créez une connexion à la base de données MySQL
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});


// Middleware combiné
const mainMiddleware = (req, res, next) => {
    // Ajouter la connexion à la base de données à la requête
    req.db = db;

    // Gestion des erreurs
    res.handleError = (error) => {
        console.error(error.stack); // Affiche l'erreur dans la console
        res.status(error.status || 500).json({
            error: error.message || 'Internal Server Error'
        });
    };

    // Vérifier la connexion à la base de données
    db.query('SELECT 1', (err) => {
        if (err) {
            return res.handleError(new Error('Database connection error'));
        }
        next();
    });
};

module.exports = mainMiddleware;
