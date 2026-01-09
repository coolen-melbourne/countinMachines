export default function guestMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    // login bo‘lgan user
    return res.redirect('/');
  }

  next();
}
