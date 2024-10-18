import "dotenv/config";
import redisConfig from "../config/redis.config";

const REDIS_EXPIRE = parseInt(process.env.REDIS_EXPIRE_TIME || "300");

export class RedisUtils {
    static async isExists(member: string) {
        const redis = await redisConfig;
        const exists = await redis.exists(member);
        console.log(`Cache exists for ${member}: ${exists}`);
        return exists;
    }

    static async setAddMember(member: string, value: any, expire: number = REDIS_EXPIRE) {
        const redis = await redisConfig;
        const multi = redis.multi();

        multi.sAdd(member, value);
        multi.expire(member, expire);

        multi.exec(true);

        return true;
    }

    static async getSetMembers(member: string) {
        const redis = await redisConfig;
        return redis.sMembers(member);
    }

    static async deleteMember(member: string) {
        console.log("🚀 ~ RedisUtils ~ deleteMember ~ member:", member)
        const redis = await redisConfig;
        redis.del(member);

        return true;
    }

    static async deletePattern(pattern: string) {
        const redis = await redisConfig;
        const keys = await redis.keys(pattern);
        keys.forEach((key) => {
            redis.del(key);
        });

        return true;
    }
}
