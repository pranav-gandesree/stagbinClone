const express = require('express')
const connectDB= require('./database')
const app = express();
const cors = require('cors');

app.use(cors)
app.use(express.json());

app.use('/api/v1', require('./routes/paste'))

app.listen(4000, async ()=>{
    await connectDB();
    console.log('server is running on 4000 port');
})
