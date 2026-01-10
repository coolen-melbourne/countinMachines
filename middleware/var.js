import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function (req, res, next) {
  req.userId = null
  res.locals.userId = null

  // 🔗 QR uchun BASE URL (MUHIM)
  res.locals.baseUrl = `${req.protocol}://${req.get('host')}`

  const token = req.cookies?.token
  if (!token) return next()

  if (!process.env.JWT_TOKEN) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findById(decoded.userId)

    if (user) {
      req.userId = user._id.toString()
      res.locals.userId = user._id.toString()
    }
  } catch (e) {}

  next()
}
