const mysql = require('mysql2');
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

console.log('DB Host:', process.env.DATABASE_HOST);
console.log('DB User:', process.env.DATABASE_USER);
console.log('DB Password:', process.env.DATABASE_PASSWORD);
console.log('DB Name:', process.env.DATABASE);

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

db.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
  } else {
    console.log("MySQL connected ..");
  }
});

module.exports = db;
