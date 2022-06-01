const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
if (error.name === 'ValidationError') {
  return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const tokenHandler = (request, response, next) => {
  const token = request.get('Authorization')
  if (token && token.toLowerCase().startsWith('bearer ')) {
    request.token = token.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  errorHandler,
  tokenHandler,
  userExtractor
}