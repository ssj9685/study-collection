import { WebSocketServer } from 'ws';
import { createServer } from 'https';
import { readFileSync } from 'fs';

const server = createServer({
    cert: readFileSync('./cert.pem'),
    key: readFileSync('./privkey.pem')
});

const wss = new WebSocketServer({ server });

const sockets = new Map();

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        try {
            const socketInfo = JSON.parse(data);
            sockets.set(ws, socketInfo);
        }
        catch (e) {
            console.error(e);
        }
        const socketInfo = sockets.get(ws);
        console.log({ socketInfo });
        console.log('received: %s', socketInfo.lastTranscript);
        [...sockets.keys()].forEach(socket => socket.send(socketInfo.lastTranscript));
    });

    ws.send('websocket connected!');

    sockets.set(ws, {});
});

wss.on('close', (ws) => {
    sockets.delete(ws);
})

server.listen(8080);