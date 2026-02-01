const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
    }),
);
app.use(express.json());

const pool = new Pool({
    host: process.env.PGHOST || 'db',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'weather',
    password: process.env.PGPASSWORD || 'weather',
    database: process.env.PGDATABASE || 'weather',
});

async function initDb(retries = 10) {
    try {
        await pool.query(
            'CREATE TABLE IF NOT EXISTS favorites (city_id TEXT PRIMARY KEY)',
        );
        console.log('Database ready.');
    } catch (error) {
        console.error('Database init failed.', error.message);
        if (retries > 0) {
            const waitMs = 2000;
            console.log(`Retrying database init in ${waitMs}ms... (${retries} retries left)`);
            setTimeout(() => initDb(retries - 1), waitMs);
        } else {
            process.exit(1);
        }
    }
}

app.get('/api/health', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({status: 'ok'});
    } catch (error) {
        res.status(500).json({status: 'error', message: error.message});
    }
});

app.get('/api/favorites', async (_req, res) => {
    try {
        const result = await pool.query('SELECT city_id FROM favorites ORDER BY city_id');
        res.json({cities: result.rows.map(row => row.city_id)});
    } catch (error) {
        res.status(500).json({message: 'Failed to load favorites.'});
    }
});

app.post('/api/favorites/toggle', async (req, res) => {
    const {cityId} = req.body || {};
    if (!cityId) {
        res.status(400).json({message: 'cityId is required'});
        return;
    }

    try {
        const insertResult = await pool.query(
            'INSERT INTO favorites (city_id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING city_id',
            [cityId],
        );

        if (insertResult.rowCount === 1) {
            res.json({cityId, isFavorite: true});
            return;
        }

        await pool.query('DELETE FROM favorites WHERE city_id = $1', [cityId]);
        res.json({cityId, isFavorite: false});
    } catch (error) {
        res.status(500).json({message: 'Failed to update favorite.'});
    }
});

app.delete('/api/favorites', async (_req, res) => {
    try {
        await pool.query('DELETE FROM favorites');
        res.json({status: 'cleared'});
    } catch (error) {
        res.status(500).json({message: 'Failed to clear favorites.'});
    }
});

const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    server.close(() => {
        pool.end(() => process.exit(0));
    });
});

initDb();
