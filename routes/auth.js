import { Router } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { genereteJWTToken } from '../services/token.js';
import guestMiddleware from '../middleware/guest.js';
import userMiddleware from '../middleware/user.js'
import Product from '../models/Product.js'


const router = Router()

// ===================== LOGIN GET =====================
router.get('/login', guestMiddleware, (req, res) => {
  const loginError = req.flash('loginError');
  res.render('login', {
    title: 'Login || MILANA',
    loginError: loginError.length ? loginError[0] : null
  });
});

// ===================== REGISTER GET =====================
router.get('/register', guestMiddleware, (req, res) => {
  const registerError = req.flash('registerError');
  res.render('register', {
    title: 'Register || MILANA',
    registerError: registerError.length ? registerError[0] : null
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/login')
})


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (!existUser) {
      req.flash('loginError', 'User not found');
      return res.redirect('/login');
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
      req.flash('loginError', 'Password is incorrect');
      return res.redirect('/login');
    }

    //token yaratish
    const token = genereteJWTToken(existUser._id);

   
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // localhost bo‘lsa false
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.redirect('/');

  } catch (error) {
    console.error(error);
    req.flash('loginError', 'Server error');
    res.redirect('/login');
  }
});


router.post('/products/delete/:id', userMiddleware, async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return res.redirect('/')
  }

  if (product.user.toString() !== req.userId.toString()) {
    return res.status(403).send('Ruxsat yo‘q')
  }

  await Product.findByIdAndDelete(req.params.id)
  res.redirect('/')
})






router.post('/register', async (req, res) => {
  try {
    const { firstName, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      req.flash('registerError', 'Passwords do not match');
      return res.redirect('/register');
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      req.flash('registerError', 'Email already registered');
      return res.redirect('/register');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      email,
      password: hashPassword
    });

    const token = genereteJWTToken(user._id);

 
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    req.flash('registerError', 'Server error');
    res.redirect('/register');
  }
});




export default router;
