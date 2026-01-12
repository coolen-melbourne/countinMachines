import express from 'express'
import { create } from 'express-handlebars'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import User from './models/User.js'

dotenv.config()
const app = express()

// ------------------------
// HANDLEBARS
// ------------------------
const hbs = create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    ifequal(a, b, options) {
      return a?.toString() === b?.toString()
        ? options.fn(this)
        : options.inverse(this)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('uz-UZ')
    },
    gte(a, b) {
      return a >= b
    }
  }
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './views')

// ------------------------
// MIDDLEWARE
// ------------------------
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(
  session({
    secret: 'Husancha',
    resave: false,
    saveUninitialized: false
  })
)

app.use(flash())

// ------------------------
// GLOBAL AUTH
// ------------------------
app.use(async (req, res, next) => {
  const token = req.cookies?.token
  res.locals.token = false
  res.locals.userId = null
  res.locals.user = null

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN)
      const user = await User.findById(decoded.userId).lean()

      if (user) {
        res.locals.token = true
        res.locals.userId = user._id.toString()
        res.locals.user = user
        req.userId = user._id
        req.user = user
      }
    } catch {
      res.locals.token = false
    }
  }

  next()
})

// ------------------------
// ROUTES
// ------------------------
app.use(authRoutes)
app.use(productsRoutes)

// ------------------------
// DB
// ------------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo error:', err.message)
    process.exit(1)
  })

// ------------------------
// SERVER
// ------------------------
const PORT = 3100
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running:`)
  console.log(`👉 Local:  http://localhost:${PORT}`)
  console.log(`👉 LAN:    http://<SERVER_IP>:${PORT}`)
})
