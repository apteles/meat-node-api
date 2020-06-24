import * as Restify from 'restify'
import {env} from '../common/env'
export class Server{

  application: Restify.Server

  initRoutes(): Promise<any>{
    return new Promise((resolve,reject)=>{
      try {
        this.application = Restify.createServer({
          name:'meat-api',
          version: '1.0.0'
        })

        this.application.use(Restify.plugins.queryParser())

        this.application.get('/', (req,res,next) => {
          res.json({message: 'hello'})
        
          return next()
        })

        this.application.listen(env.server.port, () => resolve(this.application))
      } catch (error) {
        reject(error)
      }
    })
  }

  async bootstrap(): Promise<Server>{
    return this.initRoutes().then( () => this)
  }
}