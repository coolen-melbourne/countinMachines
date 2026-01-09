import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.redirect('/login'); // token yo'q => login sahifasiga yo'naltir
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_TOKEN);
        } catch (err) {
            return res.redirect('/login'); // token noto'g'ri => login sahifasiga yo'naltir
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.redirect('/login'); // user topilmadi => login sahifasiga yo'naltir
        }

        req.userId = user._id; // keyingi route’lar uchun userId qo'shildi
        req.user = user;

        next(); // middleware muvaffaqiyatli o‘tgan => keyingi route ishlaydi
    } catch (err) {
        return res.redirect('/login');
    }
}
