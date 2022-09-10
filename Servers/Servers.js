require('http2-express-bridge');
const express = require('express');
const http = require('http2');
const app = express();
const path = require('path');
const { readFileSync } = require('fs');
const {WebSocketServer} = require('ws');
const server = http.createSecureServer({
    key:readFileSync(path.join('Cert','cert.key')),
    cert:readFileSync(path.join('Cert','cert.crt')),
    allowHTTP1:true
},app);
const wsServer = new WebSocketServer({ server });
try {
    server.listen(3000, () => {
        console.log('Ok!');
    })
} catch (err) {
    console.log('Hmm.');
}
module.exports = {app,wsServer};