const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const templateRoutes = require('./routes/templateRoutes')
// const formRoutes = require('./routes/formRoutes')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/templates', templateRoutes)
// app.use('/api/forms', formRoutes)

module.exports = app
