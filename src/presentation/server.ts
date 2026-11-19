import express, { Router } from 'express';
import type { Server as HttpServer } from 'http';
import colors from 'colors';

interface Options {
    port?: number;
    routes: Router;
}

export class Server {

    public readonly app = express();
    private readonly port: number;
    private serverListener?: HttpServer;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port = 3000, routes } = options;
        this.port = port;
        this.routes = routes;
    }

    async start() {

        // *Middelware-----------------------------------------
        this.app.use(express.json());

        // *x-www-form-urlencoded------------------------------
        this.app.use(express.urlencoded({ extended: true }));
        
        // *Routes--------------------------------------------
        this.app.use('/api', this.routes);

        // *Correr servidor-----------------------------------
        this.serverListener = this.app.listen(this.port, () => {
            console.log(colors.green.bold(`Server running in port ${this.port}`));
        });

    }

    public close() {
        this.serverListener?.close();
    }
}