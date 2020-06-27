import {Document, Schema, model} from 'mongoose'
import {IRestaurant} from '../restaurants/restaurants.model'
import {TUser} from '../users/users.model'
export interface IReview extends Document{
  date: String,
  rating: Number,
  comments: String
  restaurant: Schema.Types.ObjectId | IRestaurant,
  user: Schema.Types.ObjectId | TUser,
}

const ReviewSchema = new Schema({
  date:{
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comments:{
    type: String,
    required: true,
    maxlength: 500
  },
  restaurant:{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default model<IReview>('Review',ReviewSchema)