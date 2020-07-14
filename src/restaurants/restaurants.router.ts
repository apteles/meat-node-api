import {Server,Request,Response,Next} from 'restify';
import ModelRouter from '../common/model-router'
import { NotFoundError } from 'restify-errors'
import Restaurant, {IRestaurant} from '../restaurants/restaurants.model'
import {authorize} from '../security/authz.handler'

class RestaurantsRouter extends ModelRouter<IRestaurant> {

  constructor(){
    super(Restaurant)
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  envelope(document: any):any{
    let resource = super.envelope(document)
    resource._links.menu = `${this.basePath}/${resource._id}/menu`
    return resource
  }
  
  findMenu = async (req:Request,res:Response,next:Next) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id,"+menu")
      if(!restaurant){
        throw new NotFoundError("Restaurant not found");
      }
      return this.render(res,next)(restaurant)
    } catch (error) {
      next(error)
    }
  }

  replaceMenu = async (req:Request,res:Response,next:Next) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id)
      if(!restaurant){
        throw new NotFoundError("Restaurant not found");
      }
      restaurant.menu = req.body
      return this.render(res,next)(await restaurant.save() )
    } catch (error) {
      next(error)
    }
  }

  applyRoutes(application: Server) {
    application.get(`${this.basePath}`, this.findAll);
    application.get( `${this.basePath}/:id`, [ this.validateId, this.findById]);
    application.post(`${this.basePath}`, [authorize('admin'),this.save]);  
    application.put(`${this.basePath}/:id`, [authorize('admin'), this.validateId,this.replace]);
    application.patch(`${this.basePath}/:id`, [authorize('admin'), this.validateId,this.update]);
    application.del(`${this.basePath}/:id`, [ authorize('admin'),this.validateId,this.delete]); 
    application.get(`${this.basePath}/:id/menu`, [ this.validateId,this.findMenu]); 
    application.put(`${this.basePath}/:id/menu`, [ authorize('admin'),this.validateId,this.replaceMenu]);
  }
}

export default new RestaurantsRouter