const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const answerRoutes = require('./routes/answerRoutes');
const authRoutes = require('./routes/authRoutes')
const templateRoutes = require('./routes/templateRoutes')
const userRoutes = require('./routes/userRoutes')
const salesforceRoutes = require('./routes/salesforceRoutes')
const externalRoutes = require('./routes/externalRoutes')
const powerAutomate = require('./routes/powerAutomate')

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/answers', answerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/salesforce', salesforceRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/integration-power', powerAutomate);

module.exports = app