import {Schema,model,Document} from 'mongoose'
import {validateCPF} from '../common/validators'
import * as bcrypt from 'bcrypt'
export interface User extends Document{
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

UserSchema.pre('save', function(next){
  const user: User = this
  if(!user.isModified('password')){
    next()
  }else{
    bcrypt.hash(user.password,10).then(hash => {
      user.password = hash
      next()
    }).catch(next)
  }
})

export default model<User>('User', UserSchema)