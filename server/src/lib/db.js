import mongoose from "mongoose";

async function connectDB() {
    try{
        const mongoURI = process.env.MONGODB_URI;
        if(!mongoURI){
            throw new Error("MONGODB_URI is not defined");
        }
        const connection = await mongoose.connect(mongoURI);

        console.log("Connected to MongoDB", connection.connection.host);
    }catch(error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB