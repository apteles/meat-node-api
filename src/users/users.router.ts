import {Server, Request, Response, Next} from 'restify';

import ModelRouter from '../common/model-router'
import User, {TUser} from '../users/users.model'
class UsersRouter extends ModelRouter<TUser> {

  constructor(){
    super(User)
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  applyRoutes(application: Server) {
    application.get('/users', this.findAll);
    application.get('/users/:id', [ this.validateId, this.findById]);
    application.post('/users', this.save);  
    application.put('/users/:id', [ this.validateId,this.replace]);
    application.patch('/users/:id', [ this.validateId,this.update]);
    application.del('/users/:id', [ this.validateId,this.delete]); 
  }
}

export default new UsersRouter