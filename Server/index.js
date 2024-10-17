const express = require('express')
const app = express();
const connectMongo = require('./db')
const cors = require('cors')
connectMongo();

app.use(cors())
app.use(express.json())
app.use('/author', require('./routes/author'))
app.use('/notes',require('./routes/notes'))

app.listen (5000,()=>{
    console.log('connected to port no 5000');
})