import express from 'express'
import connectDB from "./lib/db.js" 
import { clerkMiddleware } from '@clerk/express' 
import cors from "cors"
import "dotenv/config"
import fs from "fs"
import path from "path"
import job from "./lib/cron.js"
import clerkWebhook from "./webhooks/clerk.webhook.js"

const app = express()

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const publicDir = path.join(process.cwd(), "public")
app.use("/api/webhooks/clerk", express.raw({type: "application/json"}), clerkWebhook)

app.use(express.json())
app.use(cors({origin: CLIENT_URL, credentials: true}))
app.use(clerkMiddleware())

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir));

    app.get("{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err)=> next(err));
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`)

    if(process.env.NODE_ENV === "production"){
        job.start()
    }
})