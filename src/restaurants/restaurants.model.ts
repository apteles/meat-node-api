import {Document, Schema, model} from 'mongoose'

export interface MenuItem extends Document{
 name: String,
 price: Number 
}
export interface IRestaurant extends Document{
  name: String,
  menu: MenuItem[] 
}

const MenuSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})
const RestaurantSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  menu: {
    type: [MenuSchema],
    required: false,
    select: false,
    default: []
  }
})

export default model<IRestaurant>('Restaurant',RestaurantSchema)