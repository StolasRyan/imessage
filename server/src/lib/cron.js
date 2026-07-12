import {CronJob} from "cron";
import http from "node:http";
import https from "node:https";

const job = new CronJob("*/14 * * * *", function (){
    const base = process.env.CLIENT_URL;
    if(!base) return;
    const url = new URL("/hello", base).href;
    const client = url.startsWith("https") ? https : http;

    client.get(url, (res)=>{
        if(res.statusCode === 200){
            console.log("Cron job executed successfully");
        }else{
            console.log("Cron job failed", res.statusCode);
        }
    }).on("error", (e)=>console.error("Error executing cron job",e))
})

export default job
