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
        const io = require('socket.io').listen(server);
        this.socket(io);
        console.log('scoket');
        return this.app;
    }


    private socket(io: any) {
        let players: Array<any>= [];
        let userReady: any = {};


        io.sockets.on('connection', (socket: any) => {
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
                        players[0] = players[1];
                        players[1] = { user: user, ready: false};
                    }
                    newUser = players.find(el => el.user === user);

                }
                console.log('newplay', players);
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



                socket.on('disconnect', () => {
                    console.log('disconnected');
                })
            });
        });

    }

    getRandomIntervalInMS(max: number, min: number) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    }




}