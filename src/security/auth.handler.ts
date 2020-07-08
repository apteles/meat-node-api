import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import {NotAuthorizedError} from 'restify-errors'
import User from '../users/users.model'
import {env} from '../common/env'

export const authenticate: restify.RequestHandler = (req,res,next) =>{
  const {email,password} = req.body

  User.findByEmail(email).then(user => {
    if(user && user.matches(password)){
      
      const token = jwt.sign({sub:user.email, iss: 'meat-api'}, env.apiSecret)
       
      res.json({
        name: user.name,
        email: user.email,
        token
      })
      return next
    }else{
      return next(new NotAuthorizedError('Invalid credentials'))
    }
  }).catch(next)
}