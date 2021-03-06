import {Server, Request, Response, Next} from 'restify';
import {DocumentQuery} from 'mongoose'
import ModelRouter from '../common/model-router'
import Review, {IReview} from './reviews.model'
import {authorize} from '../security/authz.handler'
class ReviewsRouter extends ModelRouter<IReview> {

  constructor(){
    super(Review)
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  envelope(document: any):any{
    let resource = super.envelope(document)
    const restID = document.restaurant._id || document.restaurant 
    resource._links.restaurant = `/restaurants/${restID}`
    return resource
  }


  // findById = async (req:Request,res:Response,next:Next) => {
  //   try {
  //     const model = await this.model.findById(req.params.id).populate('user','name').populate('restaurant')
  //     return this.render(res,next)(model)
  //   } catch (error) {
  //       next(error)
  //   }
  // }

  protected prepareOne(query:DocumentQuery<IReview,IReview>):DocumentQuery<IReview,IReview>{
    return query.populate('user','name').populate('restaurant','name')
  }

  applyRoutes(application: Server) {
    application.get('/reviews', this.findAll);
    application.get('/reviews/:id', [ this.validateId, this.findById]);
    application.post('/reviews', [authorize('user'),this.save]);
  }
}

export default new ReviewsRouter