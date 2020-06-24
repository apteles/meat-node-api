import {Server, Request, Response, Next} from 'restify';
import Router from '../common/router'
import User from '../users/users.model'

class UsersRouter extends Router{
  applyRoutes(application: Server) {
     application.get('/users', (req:Request,res:Response,next:Next) => {
      User.findAll().then(users =>{
        res.json(users);
      })
    });  

    application.get('/users/:id', (req:Request,res:Response,next:Next) => {
      User.findById(req.params.id).then( user =>{
        if(!user.length) res.send(404,'Data not found'); next();
        res.json(user[0]);
        return next();
      })
    });  
  }
}

export default new UsersRouter