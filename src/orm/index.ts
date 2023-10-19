import 'reflect-metadata';
import { AppDataSource } from '../data-source';

AppDataSource.initialize().then(() => {
    AppDataSource.synchronize().then(() => {
        console.log("Database initialized and synchronized.");
    }).catch((error) => {
        AppDataSource.destroy();
        console.error(error);
        throw new Error(`Failed to synchronize database. Error: ${error}`);
    });
}).catch((error) => {
    AppDataSource.destroy();
    console.error(error);
    throw new Error(`Failed to initialize database. Error: ${error}`);
});