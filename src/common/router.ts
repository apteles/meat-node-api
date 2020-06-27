import {Server, Response, Next} from 'restify'
import { NotFoundError } from 'restify-errors'
import {EventEmitter} from 'events'
export default abstract class Router extends EventEmitter{
  abstract applyRoutes(application: Server):void

  render(response:Response, next: Next){
    return document => {
      if(document){
        this.emit('beforeRender',document)
        response.json(document)
      }else{
        throw new NotFoundError('Document not found');
      }
      return next();
    }
  }

  renderAll(response:Response, next: Next){
    return (documents: any[]) => {
      if(documents){
        documents.forEach( d => {
          this.emit('beforeRender', document)
        })
        return response.json(documents)
      }else{
        return response.json([])
      }
    }
  }
}