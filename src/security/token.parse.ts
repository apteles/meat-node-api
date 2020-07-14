import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import User from '../users/users.model'
import {env} from '../common/env'

export const tokenParser: restify.RequestHandler = (req,res,next) => {
  const token = extractToken(req)
  if(token){
    jwt.verify(token,env.apiSecret,applyBearer(req,next))
  }else{
    next()
  }
}

function extractToken(req:restify.Request){
  const authorization = req.header('authorization')
  if(authorization){
    const parts: string[] = authorization.split(' ')
    if(parts.length === 2 && parts[0] === 'Bearer'){
      return parts[1]
    }
  }
  return undefined
}

function applyBearer (req:restify.Request, next): (error, decoded) => void{
  return (error, decoded) => {
    if(decoded){
      User.findByEmail(decoded.sub).then(user => {
        if(user){ 
          req.authenticated = user
        }
        next()
      }).catch(next)
    }else{
      next()
    }
  }
}