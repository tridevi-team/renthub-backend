import { ContractService } from "@services";
import { CronJob } from "cron";

export const contractCronJob = CronJob.from({
    cronTime: "0  0  * * *",
    onTick: async () => {
        await ContractService.updateExpiredContract();
    },
    start: true,
    timeZone: "Asia/Ho_Chi_Minh",
});
