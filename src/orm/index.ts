import 'reflect-metadata';
import { AppDataSource } from '../data-source';

AppDataSource.initialize().then(() => {
    AppDataSource.synchronize();
}).catch((error) => {
    AppDataSource.destroy();
    console.error(error);
    throw new Error(`Failed to initialize database. Error: ${error}`);
});