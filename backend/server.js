const app = require('./app')
const sequelize = require('./models')
const PORT = process.env.PORT || 5000

async function start() {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')
    await sequelize.sync({ alter: true }) // dev mode
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (err) {
    console.error('Connection error:', err)
  }
}

start()
