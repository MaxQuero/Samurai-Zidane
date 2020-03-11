import {Application, Request, Response} from "express";
import express from "express";
import {connections} from "mongoose";

export default class Server {
    readonly port: number;
    app: any;

    constructor(port: number) {
        this.port = port;
    }

    start() {
        this.app = express();
        let server = this.app.listen(this.port, () => {
            console.log('Serveur démarré');

        });
        const io = require('socket.io').listen(server);
        this.socket(io);
        console.log('scoket');
        return this.app;
    }

    private socket(io: any) {
        let players: Array<any> = [];
        let userReady: any = {};
        let sequenceNumberByClient = new Map();

        let stopTimeout = false;
        io.sockets.on('connection', (socket: any) => {
            console.log(Object.keys(io.sockets.sockets).length);
            if(Object.keys(io.sockets.sockets).length > 2) {
                console.log('too many people');
                socket.emit('complet');
            }
                console.info(`Client connected [id=${socket.id}]`);
            // initialize this client's sequence number
            sequenceNumberByClient.set(socket, 1);


            socket.on('attack', (type: any) => {
                if (type === 'win') {
                    socket.emit('result', 'win');
                    socket.broadcast.emit('result', 'lost');
                } else {
                    stopTimeout = true;
                    socket.emit('result', 'lost');
                    socket.broadcast.emit('result', 'win');
                }
            });


            socket.on('newPlayer', (user: any) => {
                let newUser = players.find(el => el.user === user);

                if (!newUser) {
                    if (players.length < 2) {
                        players.push({user: user, ready: false});
                    } else {
                        players.shift();
                        players.push({user: user, ready: false});
                    }
                    newUser = players.find(el => el.user === user);
                    let otherUser = players.find(el => el.user !== user);
                    socket.broadcast.emit('player', players.indexOf(otherUser));

                }
                socket.emit('player', players.indexOf(newUser));
            });

            socket.on('ready', (user: String) => {
                let us = players.find(el => el.user === user);
                if (us) {
                    players[players.indexOf(us)]['ready'] = true;
                    if (players.length === 2) {
                        if (players[0].ready && players[1].ready) {
                            //if no one has sent ready, then do it, else these means that everybody's ready
                            socket.emit('readyAll');
                            socket.broadcast.emit('readyAll');


                            players[0]['ready'] = false;
                            players[1]['ready'] = false;
                            setTimeout(() => {
                                if (!stopTimeout) {
                                    socket.emit('go');
                                    socket.broadcast.emit('go');
                                }
                                stopTimeout = false;
                            }, this.getRandomIntervalInMS(2, 6));
                        }
                    }
                }
            });

            // when socket disconnects, remove it from the list:
            socket.on("disconnect", () => {
                sequenceNumberByClient.delete(socket);
                console.info(`Client gone [id=${socket.id}]`);
            });
        });
// sends each client its current sequence number
        setInterval(() => {
            for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
                client.emit("seq-num", sequenceNumber);
                sequenceNumberByClient.set(client, sequenceNumber + 1);
            }
        }, 1000);
    }


    getRandomIntervalInMS(max: number, min: number) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    }


}