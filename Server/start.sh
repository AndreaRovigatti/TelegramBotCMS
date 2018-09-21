#!/bin/bash
#kill task su porte interessate
fuser -k 8081/tcp
fuser -k 8082/tcp
fuser -k 8083/tcp
cd ..
cd App
gulp
cd ..
cd Server
#start thread node su porte interessate
node server.js 8081 &
node server.js 8082 &
node server.js 8083 &