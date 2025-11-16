import cron from "node-cron";
import { attendance } from "./attendance";
import { updateWallet } from "./wallet";

cron.schedule("59 23 * * *", async () => {
    await attendance();
    await updateWallet();
})