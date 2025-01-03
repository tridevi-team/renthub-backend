import dotenv from "dotenv";
import type { Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";

dotenv.config();

const DEFAULT_PORT: string = "3306";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.MYSQL_HOST_DEV,
            port: parseInt(process.env.MYSQL_PORT_DEV || DEFAULT_PORT),
            user: process.env.MYSQL_USERNAME_DEV,
            password: process.env.MYSQL_PASSWORD_DEV,
            database: process.env.MYSQL_DATABASE_DEV,
        },
        pool: {
            min: 0,
            max: 10,
        },
        migrations: {
            directory: "src/database/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: "src/database/seeds",
        },
        ...knexSnakeCaseMappers(),
    },

    staging: {
        client: "mysql2",
        connection: {
            host: process.env.MYSQL_HOST_LOCAL,
            port: parseInt(process.env.MYSQL_PORT_LOCAL || DEFAULT_PORT),
            user: process.env.MYSQL_USERNAME_LOCAL,
            password: process.env.MYSQL_PASSWORD_LOCAL,
            database: process.env.MYSQL_DATABASE_LOCAL,
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
        ...knexSnakeCaseMappers(),
    },

    production: {
        client: "mysql2",
        connection: {
            host: process.env.MYSQL_HOST_PROD,
            port: parseInt(process.env.MYSQL_PORT_PROD || DEFAULT_PORT),
            user: process.env.MYSQL_USERNAME_PROD,
            password: process.env.MYSQL_PASSWORD_PROD,
            database: process.env.MYSQL_DATABASE_PROD,
        },
        pool: {
            min: 0,
            max: 10,
        },
        migrations: {
            directory: "src/database/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: "src/database/seeds",
        },
        ...knexSnakeCaseMappers(),
    },
};

export default config;
