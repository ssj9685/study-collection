import https from 'https';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import config from './config.json'  with { type: "json" };
import fs from 'fs';

const app = express()
app.use(express.json());
app.use(cors())

const hostname = "deploy-test3.p-e.kr";
const port = 4000;

const key = fs.readFileSync(
    `/etc/letsencrypt/live/${hostname}/privkey.pem`,
    { encoding: "utf-8" }
);

const cert = fs.readFileSync(
    `/etc/letsencrypt/live/${hostname}/cert.pem`,
    { encoding: "utf-8" }
);

const server = https.createServer({
    key, cert
}, app);

const tableName = "guestbook";

const client = new pg.Pool(config);

client.connect();

function excuteQuery(query, values) {
    return new Promise((resolve, reject) => {
        client.query(query, values, (err, result) => {
            if (err) {
                reject(err);

                return;
            }

            resolve(result.rows);
        });
    })
}

app.get('/', async (req, res) => {
    try {
        const result = await excuteQuery(`SELECT * from ${tableName} ORDER BY articleno ASC`);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(400).send(e)
    }
})

app.post('/', async (req, res) => {
    try {
        const { userid, subject, content } = req.body;
        const result = await excuteQuery(
            `INSERT INTO ${tableName} (userid, subject, content) VALUES($1, $2, $3) RETURNING *`,
            [userid, subject, content]
        );
        res.send(result);
    }
    catch (e) {
        console.error(e);
        res.status(400).send(e)
    }
});

app.patch('/:articleno', async (req, res) => {
    try {
        const { subject, content } = req.body;
        const { articleno } = req.params;

        const result = await excuteQuery(
            `UPDATE ${tableName} SET subject = $1, content = $2 WHERE articleno = ${articleno} RETURNING *`,
            [subject, content]);

        res.send(result);
    }
    catch (e) {
        console.error(e);
        res.status(400).send(e)
    }
});

app.delete('/:articleno', async (req, res) => {
    const { articleno } = req.params;

    try {
        const result = await excuteQuery(
            `DELETE FROM ${tableName} WHERE articleno = $1 RETURNING *`,
            [articleno]
        );

        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(400).send(e);
    }
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

process.on('SIGINT', () => {
    client.end().then(() => {
        console.log('db exit.');
    });
    process.exit();
});