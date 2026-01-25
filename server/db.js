import mongoose from "mongoose"
import dotenv from "dotenv"
import  logger  from "./utils/logger.js"
dotenv.config()

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`



const Connection = async() =>{
    await mongoose.connect(MONGO_URL)
    .then(()=>{
        logger.info({}, "MongoDB connection established successfully");
    })
    .catch((err)=>{
        logger.error({errorMsg: err.message, stack: err.stack}, "Error connecting to MongoDB");
    })
}

// Graceful disconnect function
const disconnectDB = async () => {
    try {
        await mongoose.connection.close(false);
        logger.info({}, "MongoDB connection closed successfully");
        return true;
    } catch (err) {
        logger.error({errorMsg: err.message, stack: err.stack}, "Error closing MongoDB connection");
        return false;
    }
}

export default Connection;
export { disconnectDB };