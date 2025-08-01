import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`



const Connection = async() =>{
    await mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("Connection to DB successful!");
    })
    .catch((err)=>{
        console.log("This error has occurred in connecting to DB---->",err);
    })
}

export default Connection;