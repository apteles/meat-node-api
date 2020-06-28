import {Server, Response, Next} from 'restify'
import { NotFoundError } from 'restify-errors'
import {EventEmitter} from 'events'
export default abstract class Router extends EventEmitter{
  abstract applyRoutes(application: Server):void

  envelope(document: any):any{
    return document
  }

  envelopeAll(documents: any[], options:any = {}): any{
    return documents
  }

  render(response:Response, next: Next){
    return document => {
      if(document){
        this.emit('beforeRender',document)
        response.json(this.envelope(document))
      }else{
        throw new NotFoundError('Document not found');
      }
      return next();
    }
  }

  renderAll(response:Response, next: Next, options: any = {}){
    return (documents: any[]) => {
      if(documents){
        documents.forEach( (doc,index, arr) => {
          this.emit('beforeRender', doc)
         
          arr[index] = this.envelope(doc)
         
        })         
        return response.json(this.envelopeAll(documents,options))
      }else{
        return response.json(this.envelopeAll([],options)) 
      }
    }
  }
}