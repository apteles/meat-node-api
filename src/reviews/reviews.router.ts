import {Server, Request, Response, Next} from 'restify';
import {DocumentQuery} from 'mongoose'
import ModelRouter from '../common/model-router'
import Review, {IReview} from './reviews.model'

class ReviewsRouter extends ModelRouter<IReview> {

  constructor(){
    super(Review)
    this.on('beforeRender', document => {
      document.password = undefined
    })
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
    application.post('/reviews', this.save);
  }
}

export default new ReviewsRouter