const express = require("express")
const cors = require("cors")
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
dotenv.config()

const app = express()

//middelware
app.use(cors({credentials: true, origin: process.env.APP_URL}))
app.use(cookieParser())
app.use(express.json())

//routes
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const blogRoutes = require('./routes/blogRoutes')
const consultaionRoutes = require('./routes/consultationRoutes')
const ReviewRoutes = require('./routes/reviewRoutes')

app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', blogRoutes)
app.use('/api', consultaionRoutes)
app.use('/api', ReviewRoutes)


//db connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( result => app.listen(process.env.PORT, console.log('the server is running')))
.catch(err => console.log(err))