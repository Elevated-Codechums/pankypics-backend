import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const DB_URI = process.env.DATABASE_URL;

const poolDB = new Pool({
    connectionString: DB_URI,
    ssl: {
        rejectUnauthorized: false
    }
});

poolDB.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

poolDB.connect((err, client, release) => {
if (err) {
return console.error('Error acquiring client', err.stack);
}
console.log('Connected to the database successfully');
release();
});



export default poolDB;
