const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')



const app = express()
const port = process.env.port || 3000

app.use(express.json())
app.use(userRouter, taskRouter)

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})