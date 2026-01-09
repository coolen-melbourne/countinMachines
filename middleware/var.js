import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function (req, res, next) {
  res.locals.userId = null

  const token = req.cookies?.token
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findById(decoded.userId)

    if (user) {
      req.userId = user._id
      res.locals.userId = user._id.toString()
    }
  } catch (e) {}

  next()
}
