const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on("connected", ()=>{
            console.log("Database Connect")
        })

        connection.on('error', (error)=>{
            console.log("Something worng in database", error)
        })
    } catch (error) {
        console.log("Something wrong", error)   
    }
}

module.exports = connectDB