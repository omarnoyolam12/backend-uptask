import express from 'express';
import type { Server as HttpServer } from 'http';
import colors from 'colors';

interface Options {
    port?: number;
}

export class Server {

    public readonly app = express();
    private readonly port: number;
    private serverListener?: HttpServer;

    constructor(options: Options) {
        const { port = 3000 } = options;
        this.port = port;
    }

    async start() {

        // *Middelware-----------------------------------------
        this.app.use(express.json());

        // *x-www-form-urlencoded------------------------------
        this.app.use(express.urlencoded({ extended: true }));

        this.serverListener = this.app.listen(this.port, () => {
            console.log(colors.green.bold(`Server running in port ${this.port}`));
        });
    }

    public close() {
        this.serverListener?.close();
    }
}