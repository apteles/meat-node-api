import * as Restify from 'restify'
import {connect, MongooseThenable,ConnectionOptions} from 'mongoose'
import {env} from '../common/env'
import Router from '../common/router'

export type TServer = {
  application: Restify.Server,
  initRoutes(routers: Router[]): Promise<any>,
  bootstrap(routers: Router[]): Promise<Server>,
}
export class Server{

  application: Restify.Server

  initializeDB():MongooseThenable{
    return connect(<string>env.db.url,<ConnectionOptions>{
      useNewUrlParser:  true,
      useUnifiedTopology: true
    })      
  }

  initRoutes(routers: Router[]): Promise<any>{
    return new Promise((resolve,reject)=>{
      try {
        this.application = Restify.createServer({
          name:'meat-api',
          version: '1.0.0'
        })

        this.application.use(Restify.plugins.queryParser())

        routers.forEach((router:Router) => router.applyRoutes(this.application))

        this.application.listen(env.server.port, () => resolve(this.application))
      } catch (error) {
        reject(error)
      }
    })
  }

  async bootstrap(routers: Router[] = []): Promise<Server>{    
    return this.initializeDB().then(() =>  this.initRoutes(routers).then( () => this))
    
  }
}