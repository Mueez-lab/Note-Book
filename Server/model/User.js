const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: new Date().toISOString()
    }
})

module.exports = mongoose.model('user',userSchema)