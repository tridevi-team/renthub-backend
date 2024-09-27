import "dotenv/config";
import { createClient } from "redis";

const nodeEnv = process.env.NODE_ENV || "development";
let redisUrl = "";
let redisDb = 0;

switch (nodeEnv) {
    case "development":
        redisUrl = process.env.REDIS_DEV_URL || "redis://localhost:6379/0";
        redisDb = Number(process.env.REDIS_DEV_DB) || 0;
        break;
    case "production":
        redisUrl = process.env.REDIS_PROD_URL || "redis://localhost:6379/0";
        redisDb = Number(process.env.REDIS_PROD_DB) || 0;
        break;
    case "staging":
        redisUrl = process.env.REDIS_LOCAL_URL || "redis://localhost:6379/0";
        redisDb = Number(process.env.REDIS_LOCAL_DB) || 0;
        break;
    default:
        redisUrl = process.env.REDIS_DEV_URL || "redis://localhost:6379/0";
        redisDb = Number(process.env.REDIS_DEV_DB) || 0;
        break;
}

redisUrl += redisDb;

const redisClient = async () =>
    await createClient({
        url: redisUrl,
    })
        .on("error", (error) => {
            console.error(error);
        })
        .connect();

export default redisClient();
