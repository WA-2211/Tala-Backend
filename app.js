// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const cors = require('cors')

// Routes Import
const authRoutes = require('./routes/auth.routes')
const placeRoutes = require('./routes/place.routes')
const visitRoutes = require('./routes/visit.routes')
const favoriteRoutes = require('./routes/favorite.routes')
const reviewRoutes = require('./routes/review.routes')

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    })
);
app.use(express.json())
app.use(morgan('dev'))



// Routes
app.use('/auth',authRoutes)
app.use('/place', placeRoutes)
app.use('/visit', visitRoutes)
app.use('/favorite', favoriteRoutes)
app.use('/place/:placeId/review', reviewRoutes)


module.exports = app