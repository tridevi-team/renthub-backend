import { createClient } from "redis";

const redisClient = async () =>
    await createClient({
        url: "redis://localhost:6379/1",
    })
        .on("error", (error) => {
            console.error(error);
        })
        .connect();

export default redisClient();
