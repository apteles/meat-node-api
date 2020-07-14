import * as Restify from 'restify'
import * as mongoose from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'
import {env} from '../common/env'
import Router from '../common/router'
import mergePathParser from './merge-path.parser';
import handleError from './error.handler';
import { tokenParser } from '../security/token.parse';

export type TServer = {
  application: Restify.Server,
  initRoutes(routers: Router[]): Promise<any>,
  bootstrap(routers: Router[]): Promise<Server>,
}
export class Server{

  application: Restify.Server

  initializeDB():mongoose.MongooseThenable{
    return mongoose.connect(<string>env.db.url,<mongoose.ConnectionOptions>{
      useNewUrlParser:  true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })      
  }

  initRoutes(routers: Router[]): Promise<any>{
    return new Promise((resolve,reject)=>{
      try {
        this.application = Restify.createServer({
          name:'meat-api',
          versions: ['1.0.0', '2.0.0'],
          //certificate: fs.readFileSync( path.join(__dirname, '..','security', 'keys','cert.pem')), 
          //key: fs.readFileSync( path.join(__dirname, '..','security', 'keys','key.pem')),

        })
        console.log(__dirname);
        

        this.application.use(Restify.plugins.queryParser())
        this.application.use(Restify.plugins.bodyParser())
        this.application.use(mergePathParser)
        this.application.use(tokenParser)

        routers.forEach((router:Router) => router.applyRoutes(this.application))

        this.application.listen(env.server.port, () => resolve(this.application))

        this.application.on('restifyError',handleError)

      } catch (error) {
        reject(error)
      }
    })
  }

  async bootstrap(routers: Router[] = []): Promise<Server>{    
    return this.initializeDB().then(() =>  this.initRoutes(routers).then( () => this)) 
  }

  async shutdown(){
    await mongoose.disconnect()
    await this.application.close()
  }
}