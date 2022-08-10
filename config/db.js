const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err){ 
        console.error(err)
        process.exit(1) //1 tells it to exit with an error. exit process so it doesn't hangup
    }
}
module.exports = connectDB   //we're not calling a function, we are exporting it to another file app.js