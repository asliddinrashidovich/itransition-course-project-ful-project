const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const answerRoutes = require('./routes/answerRoutes');
const authRoutes = require('./routes/authRoutes')
const templateRoutes = require('./routes/templateRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/answers', answerRoutes);
app.use('/api/users', userRoutes);

module.exports = app