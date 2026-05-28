const express = require('express')
const cors = require('cors')
const { swaggerUi, specs } = require('./config/swagger')

const authRoutes = require('./routes/authRoutes')
const restaurantRoutes = require('./routes/restaurantRoutes')
const foodRoutes = require('./routes/foodRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const promotionRoutes = require('./routes/promotionRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/foods', foodRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/promotions', promotionRoutes)
app.use('/api/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.send('API Running... Visit /api-docs for documentation.')
})

module.exports = app
