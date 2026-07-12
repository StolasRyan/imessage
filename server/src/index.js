import express from 'express'
import connectDB from "./lib/db.js" 
import { clerkMiddleware } from '@clerk/express' 
import cors from "cors"
import "dotenv/config"

const app = express()

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"

app.use(express.json())
app.use(cors({origin: CLIENT_URL, credentials: true}))
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`)
})