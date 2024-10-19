import "dotenv/config";
import redisConfig from "../config/redis.config";
import { Filter } from "../interfaces";

const REDIS_EXPIRE = parseInt(process.env.REDIS_EXPIRE_TIME || "300");

export class RedisUtils {
    static generateCacheKeyWithFilter(prefix: string, filterData: Filter) {
        const filterString = filterData.filter?.map((f) => `${f.field}:${f.operator}:${f.value}`).join("|");
        const sortString = filterData.sort?.map((s) => `${s.field}:${s.direction}`).join("|");
        const paginationString = `page_${filterData.pagination.page},pageSize_${filterData.pagination.pageSize}`;

        return `${prefix}:filter_${filterString}:sort_${sortString}:${paginationString}`;
    }

    static generateCacheKeyWithId(prefix: string, id: string, postfix?: string) {
        return `${prefix}:${id}${postfix ? `:${postfix}` : ""}`;
    }

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
        console.log("🚀 ~ RedisUtils ~ deleteMember ~ member:", member);
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
