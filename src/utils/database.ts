import "reflect-metadata";
import { DataSource } from "typeorm";

// Entities
import { KnowledgeBaseEntry } from "src/entity/KnowledgeBaseEntry";
import { SessionArticleSort } from "src/entity/SessionArticleSort";
import { LearningSession } from "src/entity/LearningSession";
import { Recommendation } from "src/entity/Recommendation";
import { KnowledgeBase } from "src/entity/KnowledgeBase";
import { ArticleCache } from "src/entity/ArticleCache";
import { Membership } from "src/entity/Membership";
import { SessionTag } from "src/entity/SessionTag";
import { Priority } from "src/entity/Priority";
import { Article } from "src/entity/Article";
import { Goal } from "src/entity/Goal";
import { Note } from "src/entity/Note";

import {
    getDatabaseHost, getDatabaseName,
    getDatabaseUsername, getDatabasePassword
} from "src/utils/secrets";

export const createDataSource = async (): Promise<DataSource> => {
    const DB_PORT = parseInt("3306");
    let DB_HOST: string;
    try {
        DB_HOST = await getDatabaseHost();
    } catch (error) {
        console.log("Error getting database host: ", error);
        throw error;
    }
    let DB_NAME: string;
    try {
        DB_NAME = await getDatabaseName();
    } catch (error) {
        console.log("Error getting database name: ", error);
        throw error;
    }
    let DB_USERNAME: string;
    try {
        DB_USERNAME = await getDatabaseUsername();
    } catch (error) {
        console.log("Error getting database username: ", error);
        throw error;
    }
    let DB_PASSWORD: string;
    try {
        DB_PASSWORD = await getDatabasePassword();
    } catch (error) {
        console.log("Error getting database password: ", error);
        throw error;
    }

    return new DataSource({
        type: "mysql",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        synchronize: true,
        logging: false,
        entities: [
            KnowledgeBaseEntry,
            SessionArticleSort,
            LearningSession,
            Recommendation,
            KnowledgeBase,
            ArticleCache,
            Membership,
            SessionTag,
            Priority,
            Article,
            Goal,
            Note
        ],
        migrations: [],
        subscribers: [],
    });
}
