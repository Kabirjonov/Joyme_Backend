const jwt = require('jsonwebtoken')
const config = require('config')
module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({ message: "Token bo'lmaganligi uchun murojat rad etildi" })
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))// webtokeni xaqiqiy ekanligini tekshirish uchun
        req.user = decoded;
        next()
    } catch (err) {
        return res.status(400).json({ message: "Json-Web-Token yaroqsiz" })
    }
}