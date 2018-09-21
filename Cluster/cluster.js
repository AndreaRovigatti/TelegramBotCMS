const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const httpProxy = require('http-proxy');
const fs = require('fs');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  require('./proxy');

  // Fork workers. NB:sfrutto 3 cpu
  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  //Creo 3 thread sulla stessa porta ma diverse cpu
  require('../Server/server');

  console.log(`Worker ${process.pid} started`);
}
