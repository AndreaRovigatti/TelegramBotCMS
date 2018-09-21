#!/bin/bash
#kill task su porte interessate
fuser -k 8080/tcp
fuser -k 8081/tcp
#fuser -k 11211/tcp
#attivo memcached su porta 11211, limite max 50 MB, utente daemon
#memcached -m 50 -p 11211 -u daemon
#compilazione app(gulp)
cd ..
cd App
gulp
#start App
cd ..
cd Cluster
node cluster.js