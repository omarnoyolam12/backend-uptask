import { Server } from "./presentation/server";
import { envs } from "./config/envs";
import { MongoDatabase } from "./data/mongo/mongo.database";

(() => {
    main();
})();

async function main() {
    
    // *Conectar a la base de datos
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DBNAME,
    });

    // *Crear servidor
    const server = new Server({});
    server.start();

}
