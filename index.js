import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
//import Router
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import DiseaseRoute from './Routes/DiseaseRoute.js'
// import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'

const app = express()
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

dotenv.config()

//Connect DB & start sever
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT || 5000, () =>
      console.log(
        `Connected to MongoDB - Sever on localhost:${process.env.PORT}`,
      ),
    ),
  )

//Routes
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/type-disease', DiseaseRoute)
// app.use('/post', PostRoute)
app.use('/upload', UploadRoute)
