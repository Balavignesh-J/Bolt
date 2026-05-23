import mongoose from "mongoose";

const ConnectDB = async ()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("MongoDB Connected");  
        })
        await mongoose.connect(`${process.env.MONGODB_URL}`)
    } catch (error) {
        console.log(error.message)
    }
}

export default ConnectDB;