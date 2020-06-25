import {Server, Response, Next} from 'restify'
import {EventEmitter} from 'events'
export default abstract class Router extends EventEmitter{
  abstract applyRoutes(application: Server):void

  render(response:Response, next: Next){
    return document => {
      if(document){
        this.emit('beforeRender',document)
        response.json(document)
      }else{
        response.send(404)
      }
      return next();
    }
  }
}