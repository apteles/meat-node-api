import {Request,Response,Next} from 'restify'
import { BadRequestError } from 'restify-errors'

const mpContentType = 'application/merge-patch+json';

export default (req:Request, res:Response, next: Next) => {
  if(req.getContentType() === mpContentType && req.method === 'PATCH'){
    (<any>req).rawBody = req.body
    try {
      req.body = JSON.parse(req.body)
    } catch (error) {
      return next(new BadRequestError(`Invalid content: ${error.message}`))
    }

  }
  return next()
}