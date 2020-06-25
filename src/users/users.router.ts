import {Server, Request, Response, Next} from 'restify';
import Router from '../common/router'
import User from '../users/users.model'

class UsersRouter extends Router{
  applyRoutes(application: Server) {
     application.get('/users', async (req:Request,res:Response,next:Next) => {
     
      const users = await User.find();
      res.json(users);
      
      return next();

    });  

    application.get('/users/:id', async (req:Request,res:Response,next:Next) => {

      const user = await User.findById(req.params.id)

      if(!user) res.send(404,'Data not found'); next();
        res.json(user);
        return next();
    
    });  

    application.post('/users', async (req:Request,res:Response,next:Next) => {

      let user = new User(req.body);
      user = await user.save()
      
      res.json(user);
      return next();
    
    });  

    application.put('/users/:id', async (req:Request,res:Response,next:Next) => {

      const user = await User.update({_id: req.params.id},req.body, {overwrite: true})
     if(user.ok){
      res.json(await User.findById(req.params.id));

      return next();
     }
     
    
    }); 
  }
}

export default new UsersRouter