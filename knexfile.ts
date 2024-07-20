import { knexSnakeCaseMappers } from "objection";
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql",
        connection: {
            host: process.env.MYSQL_HOST,
            port: 3306,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_DEV,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
        seeds: {
            directory: "src/database/seeds",
        },
        ...knexSnakeCaseMappers(),
    },

    staging: {
        client: "mysql",
        connection: {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_DEV,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "src/database/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: "src/database/seeds",
        },
    },

    production: {
        client: "mysql",
        connection: {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE_PRODUCT,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "src/database/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: "src/database/seeds",
        },
    },
};

export default config;
