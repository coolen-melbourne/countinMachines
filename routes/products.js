import { Router } from 'express'
import multer from 'multer'
import Product from '../models/Product.js'
import Counter from '../models/Counter.js'
import userMiddleware from '../middleware/user.js'

const router = Router()
const upload = multer({ dest: 'uploads/' })

// ------------------------
// HOME
// ------------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 }).lean()
    res.render('home', {
      title: 'Mashinalar tizimi || Milana',
      products,
      token: !!req.cookies.token,
      userId: req.userId || null
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ------------------------
// SSE
// ------------------------
router.get('/events', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')

  const sendData = async () => {
    const products = await Product.find().sort({ date: -1 }).lean()
    const data = {
      products,
      currentUserId: req.userId || null
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  const interval = setInterval(sendData, 3000)
  req.on('close', () => clearInterval(interval))
})

// ------------------------
// ADD PRODUCT
// ------------------------
router.get('/add', userMiddleware, (req, res) => {
  res.render('add', {
    title: 'ADD || Milana',
    erroAddPath: req.flash('erroAddPath'),
    token: !!req.cookies.token
  })
})

router.post('/add', userMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { date, name, serial, machineName, modelNumber } = req.body
    const image = req.file?.filename

    if (!image || !date || !name || !serial || !machineName || !modelNumber) {
      req.flash('erroAddPath', 'Barcha maydonlar to‘ldirilishi shart')
      return res.redirect('/add')
    }

    const exists = await Product.findOne({ serial })
    if (exists) {
      req.flash('erroAddPath', 'Bu seriya raqami allaqachon mavjud!')
      return res.redirect('/add')
    }

    const counter = await Counter.findOneAndUpdate(
      { name: 'product' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )

    await Product.create({
      number: counter.seq,
      image,
      date: new Date(date),
      name,
      serial,
      machineName,
      modelNumber,
      user: req.userId
    })

    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})

// ------------------------
// COMMENT UPDATE
// ------------------------
router.post('/products/comment/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      comment: req.body.comment
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false })
  }
})

// ------------------------
// DELETE
// ------------------------
router.post('/products/delete/:id', userMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

// ------------------------
// SINGLE PRODUCT (QR PAGE)
// ------------------------
router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).lean()
  if (!product) return res.status(404).send('Not found')

  res.render('product-single', {
    title: product.name,
    product
  })
})

export default router
