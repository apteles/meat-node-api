import {Request,Response,Next} from 'restify'

const mpContentType = 'application/merge-patch+json';

export default (req:Request, res:Response, next: Next) => {
  if(req.getContentType() === mpContentType && req.method === 'PATCH'){
    (<any>req).rawBody = req.body
    try {
      req.body = JSON.parse(req.body)
    } catch (error) {
      return next(new Error(`Invalid content: ${error.message}`))
    }

  }
  return next()
}