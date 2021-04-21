const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Set up PG to connect with the DB!!!!
const Pool = pg.Pool; // Alternat entry: const { Pool } = require('pg.Pool');
const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 30000
});

pool.on('connect', () => {
    console.log('Postgresql connected!');
});

pool.on('error', error => {
    console.log('error with postgres pool', error);
});

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

// GET artist
app.get('/artist', (req, res) => {
    console.log(`In /artist GET`);
    let queryText = 'SELECT * FROM artist ORDER BY birthdate DESC;'
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch((error) => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);
        });
});

// POST artist
app.post('/artist', (req, res) => {
    console.log('In /artist POST');
    const newArtist = `INSERT INTO artist (name, birthdate)
                        VALUES ($1, $2);`;
    const artist = {
        name: req.body.name,
        birthdate: req.body.birthdate,
    };
    console.log('In app.post', newArtist, artist);
    
    pool.query(newArtist, [req.body.name, req.body.birthdate])
        .then(result => {
            console.log('In result', newArtist, [req.body.name, req.body.birthdate]); // can log result
            if (result.rows !== []) {
                res.sendStatus(201);
            }
        })
        .catch(err => {
            console.log(`didnt work,`, artist);
            res.sendStatus(500);
        })
});

// GET song
app.get('/song', (req, res) => {
    console.log(`In /song GET`);
    let queryText = 'SELECT * FROM song ORDER BY title;'
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch((error) => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);
        });
});

// POST song
app.post('/song', (req, res) => {
    const newSong = `INSERT INTO song (title, length, released)
                        VALUES ($1, $2, $3);`;
    const song = {
        title: req.body.title,
        length: req.body.length,
        released: req.body.released,
    };
    console.log('In /song POST', song);

    pool.query(newSong, [req.body.title, req.body.length, req.body.released])
        .then(result => {
            console.log('In result', result);
            if (result.rows !== []) {
                res.sendStatus(201);
            }
        })
        .catch(err => {
            console.log(`didnt work`, song);
            res.sendStatus(500);
        })
});


