import { Request, Response, Next} from 'restify';
import { NotFoundError } from 'restify-errors'
import {Model, Document,Types} from 'mongoose'
import Router from './router'

export default abstract class ModelRouter<D extends Document> extends Router{
    constructor(protected model: Model<D>){
      super()
    }

    validateId = (req:Request,res:Response,next:Next) => {
      if(!Types.ObjectId.isValid(req.params.id)){
        next(new NotFoundError('Document not found'))
      }else{
        next()
      }
      
    }

    findAll = async (req:Request,res:Response,next:Next) => {
      try {
        const model = await this.model.find();
        return this.render(res,next)(model)
      } catch (error) {
        next(error)
      }
    }

    findById = async (req:Request,res:Response,next:Next) => {

      try {
        const model = await this.model.findById(req.params.id)
  
        return this.render(res,next)(model)
      } catch (error) {
          next(error)
      }
    
    }

    save = async (req:Request,res:Response,next:Next) => {
      try {
        let model = new this.model(req.body);
        model = await model.save()
        
        return this.render(res,next)(model)
      } catch (error) {
        next(error)
      }
    }

    replace = async (req:Request,res:Response,next:Next) => {

      const model = await this.model.update({_id: req.params.id},req.body, {overwrite: true, runValidators: true})

     if(model.ok){
      res.json(await this.model.findById(req.params.id));

      return next();
     }
     throw new NotFoundError('Document not found');
    }

    update = async (req:Request,res:Response,next:Next) => {

      const model = await this.model.findByIdAndUpdate( req.params.id,req.body,{new: true,runValidators: true})
  
      return this.render(res,next)(model)
      
    }

    delete = async (req:Request,res:Response,next:Next) => {

      const model:any = await this.model.remove( {_id: req.params.id},req.body )
        
      if(model.ok){
       res.json(204);
       return next();
      }
      res.send(404)
      return next()
      
    };
}