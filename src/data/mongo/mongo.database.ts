import mongoose from "mongoose";
import colors from "colors";
import { envs } from "../../config/envs";

interface ConnectionOptions {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {

    static async connect({ mongoUrl, dbName }: ConnectionOptions): Promise<void> {
        mongoose.connection.on("error", (err) =>
            console.error(colors.red("MongoDB error:"), err.message));
        mongoose.connection.on("disconnected", () =>
            console.warn(colors.yellow("MongoDB disconnected")));
        mongoose.connection.on("reconnected", () =>
            console.log(colors.green("MongoDB reconnected")));

        try {
            const { connection } = await mongoose.connect(mongoUrl, {
                dbName,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                autoIndex: envs.NODE_ENV !== "production",
            });
            console.log(colors.blue.bold(`MongoDB connected: ${connection.host}:${connection.port}`));
        } catch (error) {
            console.log(colors.bgRed("MongoDB connection error"));
            throw error;
        }
    }

    static async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}