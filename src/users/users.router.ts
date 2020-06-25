import {Server, Request, Response, Next} from 'restify';
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
     
      const users = await User.find();
      return this.render(res,next)(users)

    });  

    application.get('/users/:id', async (req:Request,res:Response,next:Next) => {

      const user = await User.findById(req.params.id)

      return this.render(res,next)(user)
    
    });  

    application.post('/users', async (req:Request,res:Response,next:Next) => {

      let user = new User(req.body);
      user = await user.save()
      
      return this.render(res,next)(user)
    
    });  

    application.put('/users/:id', async (req:Request,res:Response,next:Next) => {

      const user = await User.update({_id: req.params.id},req.body, {overwrite: true})
     if(user.ok){
      res.json(await User.findById(req.params.id));

      return next();
     }
     
    
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