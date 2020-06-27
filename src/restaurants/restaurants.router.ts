import {Server,Request,Response,Next} from 'restify';
import ModelRouter from '../common/model-router'
import { NotFoundError } from 'restify-errors'
import Restaurant, {IRestaurant} from '../restaurants/restaurants.model'

class RestaurantsRouter extends ModelRouter<IRestaurant> {

  constructor(){
    super(Restaurant)
    this.on('beforeRender', document => {
      document.password = undefined
    })
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
    application.get('/restaurants', this.findAll);
    application.get('/restaurants/:id', [ this.validateId, this.findById]);
    application.post('/restaurants', this.save);  
    application.put('/restaurants/:id', [ this.validateId,this.replace]);
    application.patch('/restaurants/:id', [ this.validateId,this.update]);
    application.del('/restaurants/:id', [ this.validateId,this.delete]); 
    application.get('/restaurants/:id/menu', [ this.validateId,this.findMenu]); 
    application.put('/restaurants/:id/menu', [ this.validateId,this.replaceMenu]);
  }
}

export default new RestaurantsRouter