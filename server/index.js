const express = require ('express');
const cors = require ('cors');
require('dotenv').config();
const router = require('./routes/index');
const cookiesParser = require('cookie-parser')
const {app, server} = require('./socket/index')

const connectDB = require('./config/database');


app.use(cors({
    origin: process.env.FRONTEND_URL || 3000,
    credentials : true
}));

app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.json({
        message: 'Hello, World!'
    });
});

app.use('/api', router)

connectDB().then(() => {
    server.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    }) 
})