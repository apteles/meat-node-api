import {Server, Request, Response, Next} from 'restify';
import ModelRouter from '../common/model-router'
import User, {TUser} from '../users/users.model'
import {authenticate} from '../security/auth.handler'
import {authorize} from '../security/authz.handler'
class UsersRouter extends ModelRouter<TUser> {

  constructor(){
    super(User)
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

 
  findByEmail = async (req:Request,res:Response,next:Next) => {
    try {
      if(req.query.email){
        const user = await User.find({email:req.query.email})
        return this.renderAll(res,next)(user)
      }else{
        next()
      }
      
    } catch (error) {
      next(error)
    }
  }

  applyRoutes(application: Server) {
    //application.get({path:'/users', version:'2.0.0'}, [this.findByEmail,this.findAll]);
    application.get({path:`${this.basePath}`, version:'1.0.0'}, [authorize('admin'),this.findAll]);
    application.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById]);
    application.post(`${this.basePath}`, [authorize('admin'),this.save]);  
    // Here user just can update your own data.
    application.put(`${this.basePath}/:id`, [authorize('admin','user'), this.validateId,this.replace]);
    application.patch(`${this.basePath}/:id`, [authorize('admin','user'), this.validateId,this.update]);
    application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId,this.delete]); 
    
    application.post(`${this.basePath}/authenticate`, authenticate);  
  }
}

export default new UsersRouter