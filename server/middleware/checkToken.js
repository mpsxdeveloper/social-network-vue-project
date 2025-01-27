const jwt = require('jsonwebtoken')

const check = (req, res, next) => {

    const token = req.cookies._token

    if (!token || token === undefined) {
        return res.status(403).json({ "msg": "Usuário não autorizado" })
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    }
    catch (error) {
        res.status(400).json({ "msg": "Token inválido" })
    }

}

module.exports = check