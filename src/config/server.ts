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
        let server = this.app.listen(this.port, () =>  {
            console.log('Serveur démarré');
        });
        const io = require('socket.io').listen(server, {transports: ['websocket'], upgrade: false});
        this.socket(io);
        return this.app;
    }


    private socket(io: any) {
        let client : Array<any> = [];
        let players: Array<any>= [];

        io.sockets.on('connection', (socket: any) => {
            if (players.length === 2) { return }
            console.log(io.engine.clientsCount);

            console.log('connected to socket.io');


            socket.on('attack', (type: any) => {
                console.log('attackeded', type);
                if(type === 'win') {
                    socket.emit('win');
                    socket.broadcast.emit('lost');
                } else {
                    socket.emit('lost');

                    socket.broadcast.emit('win');
                }
            });

            socket.on('newPlayer', (user:any) => {
                let newUser = players.find(el => el.user === user);

                if(!newUser) {
                    if(players.length < 2) {
                        players.push({ user: user, ready: false});
                    } else {
                        players.shift();
                        players.push({ user: user, ready: false});
                    }
                    newUser = players.find(el => el.user === user);

                }
                console.log('players', players);
                console.log('newplay', players.indexOf(newUser));
                socket.broadcast.emit('player', players.indexOf(newUser));

                socket.emit('player', players.indexOf(newUser));
            });


            socket.on('ready', (user: String) => {
                console.log(players);
                let us = players.find(el => el.user === user);
                players[players.indexOf(us)]['ready'] = true;
                console.log(players);
                if (players.length === 2) {
                    if(players[0].ready && players[1].ready){
                        //if no one has sent ready, then do it, else these means that everybody's ready
                        socket.emit('readyAll');
                        socket.broadcast.emit('readyAll');

                        players[0]['ready'] = false;
                        players[1]['ready'] = false;
                        console.log('notready', players);
                        setTimeout(() => {
                            socket.emit('go');
                            socket.broadcast.emit('go');
                        }, this.getRandomIntervalInMS(2, 6));
                    }

                }
            });


            socket.on('disconnect', function() {
                console.log('Got disconnect!');
            });
        });

    }

    getRandomIntervalInMS(max: number, min: number) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    }




}