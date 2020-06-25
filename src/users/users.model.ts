import {Schema,model,Document} from 'mongoose'

export interface User extends Document{
  name: string,
  email: string,
  password: string,
}

const UserSchema = new Schema({
  name:{
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    select: true
  }
})

export default model<User>('User', UserSchema)