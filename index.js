import express from 'express'
import { create } from 'express-handlebars'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import varMiddleware from './middleware/var.js'


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
app.use(varMiddleware)

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
// SERVER (LOCAL + LAN)
// ------------------------
const PORT = 3100
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running:`)
  console.log(`👉 Local:  http://localhost:${PORT}`)
  console.log(`👉 LAN:    http://<SERVER_IP>:${PORT}`)
})
