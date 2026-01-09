import jwt from 'jsonwebtoken'

const genereteJWTToken = userId =>{
    const accessToken =  jwt.sign({userId}, process.env.JWT_TOKEN, {expiresIn:'30d'})
    return accessToken
}

export {genereteJWTToken}