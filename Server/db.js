const mongoose = require('mongoose')
const mongooseURI ='mongodb://localhost:27017/'
const  connectMongo=async()=>{
    await mongoose.connect(mongooseURI)
    console.log('connected');
}

module.exports = connectMongo;