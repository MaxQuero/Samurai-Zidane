import {Application, Request, Response} from "express";
import express from "express";

export default class Server {
    readonly port: number;
    app: any;

    constructor(port: number) {
        this.port = port;
    }

    start() {
        this.app = express();
        this.app.get('/', function (req: Request, res: Response) {
            res.send('Salut les gens');
        });

        this.app.listen(this.port, function () {
            console.log('Serveur démarré');
        })
        return this.app;
    }
}