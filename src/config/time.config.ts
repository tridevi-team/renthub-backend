import moment from "moment-timezone";

const vietnamTimezone = moment.tz("Asia/Ho_Chi_Minh");
const currentTime = vietnamTimezone.format("YYYY-MM-DD HH:mm:ss");

export { currentTime };
