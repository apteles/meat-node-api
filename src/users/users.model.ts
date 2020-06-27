import {Schema,model,Document} from 'mongoose'
import {validateCPF} from '../common/validators'
import * as bcrypt from 'bcrypt'
export interface TUser extends Document{
  name: string,
  email: string,
  password: string,
}

const UserSchema = new Schema({
  name:{
    type: String,
    required: true,
    maxlength:80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true, 
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true
  },
  password: {
    type: String,
    select: true,
    required: true
  },
  gender:{
    type: String,
    required: false,
    enum: ['Male','Female']
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: '{PATH}: Invalid CPF({VALUE})'
    }
  }
})

const hasPassword = (obj, next) => {
  bcrypt.hash(obj.password,10).then(hash => {
    obj.password = hash
    next()
  }).catch(next)
}

const saveMiddleware = function (next){
  const user: TUser = this
  if(!user.isModified('password')){
    next()
  }else{
    hasPassword(user,next)
  }
}
const updateMiddleware = function(next){
  if(!this.getUpdate().password){
    next()
  }else{
    hasPassword(this.getUpdate(),next)
  }
}

UserSchema.pre('save', saveMiddleware)

UserSchema.pre('findOneAndUpdate', updateMiddleware)
UserSchema.pre('update', updateMiddleware)

export default model<TUser>('User', UserSchema)