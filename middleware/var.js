import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function (req, res, next) {
  // HAR DOIM mavjud bo‘lsin
  req.userId = null
  res.locals.userId = null

  // 🔗 BASE URL (QR uchun MUHIM)
  res.locals.baseUrl = `${req.protocol}://${req.get('host')}`

  const token = req.cookies?.token
  if (!token) return next()

  // Agar ENV yo‘q bo‘lsa — umuman tekshirmaymiz
  if (!process.env.JWT_TOKEN) {
    console.warn('JWT_TOKEN env topilmadi')
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findById(decoded.userId)

    if (user) {
      req.userId = user._id.toString()
      res.locals.userId = user._id.toString()
    }
  } catch (e) {
    console.warn('JWT invalid or expired')
  }

  next()
}
