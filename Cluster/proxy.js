/*
  Non basarti in tutto e per tutto a quanto scritto sul libro, la versione > 0.8 di http-proxy differisce da quella del libro
  Guida npm:
    https://www.npmjs.com/package/http-proxy
  Setup file elenco server:
    https://github.com/nodejitsu/node-http-proxy/blob/HEAD/lib/http-proxy.js#L22-L50
*/
const fs = require('fs');
const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

var options = {
  https: {
    key:fs.readFileSync('privkey.pem', 'utf8'),
    cert:fs.readFileSync('newcert.pem', 'utf8')
  }
};

var servers = JSON.parse(fs.readFileSync('listaServer.json')).servers;
var target = servers[0]; //gira su un unica porta
var proxy = httpProxy.createProxyServer({});

https.createServer(options.https, function(req, res) {
    //dirotto tutto traffico verso localhost su 8081
    req.headers.host = 'localhost:8081';
    proxy.web(req, res, target);
}).listen(8443);  

console.log("--------------");
console.log(`--Avviato proxy su porta 8443 e pid ${process.pid}--`);
console.log("--------------");
console.log("");