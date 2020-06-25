import {Server, Request, Response, Next} from 'restify';
import { NotFoundError } from 'restify-errors'
import Router from '../common/router'
import User from '../users/users.model'
import { Query } from 'mongoose';

class UsersRouter extends Router{

  constructor(){
    super()
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  applyRoutes(application: Server) {
     application.get('/users', async (req:Request,res:Response,next:Next) => {
      try {
        const users = await User.find();
        return this.render(res,next)(users)
      } catch (error) {
        next(error)
      }
    });  

    application.get('/users/:id', async (req:Request,res:Response,next:Next) => {

      try {
        const user = await User.findById(req.params.id)
  
        return this.render(res,next)(user)
      } catch (error) {
          next(error)
      }
    
    });  

    application.post('/users', async (req:Request,res:Response,next:Next) => {

      try {
        let user = new User(req.body);
        user = await user.save()
        
        return this.render(res,next)(user)
      } catch (error) {
        next(error)
      }
    
    
    });  

    application.put('/users/:id', async (req:Request,res:Response,next:Next) => {

      const user = await User.update({_id: req.params.id},req.body, {overwrite: true})

     if(user.ok){
      res.json(await User.findById(req.params.id));

      return next();
     }
     
     throw new NotFoundError('Document not found');
     
    
    }); 

    application.patch('/users/:id', async (req:Request,res:Response,next:Next) => {

    const user = await User.findByIdAndUpdate( req.params.id,req.body,{new: true})

    return this.render(res,next)(user)
    
    }); 

    application.del('/users/:id', async (req:Request,res:Response,next:Next) => {

      const user:any = await User.remove( {_id: req.params.id},req.body )
        
      if(user.ok){
       res.json(204);
       return next();
      }
      res.send(404)
      return next()
      
      }); 
  }
}

export default new UsersRouter