import {Schema,model,Document,Model} from 'mongoose'
import {validateCPF} from '../common/validators'
import * as bcrypt from 'bcrypt'
export interface TUser extends Document{
  name: string,
  email: string,
  password: string,
  profiles: string[],
  matches(password:string): boolean,
  hasAny(...profiles: string[]): boolean
}
export interface UserModel extends Model<TUser>{
  findByEmail(email: string, projection?:string): Promise<TUser>
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
  },
  profiles:{
    type: [String],
    required: false 
  }
})
UserSchema.statics.findByEmail = function(email: string, projection: string){
  return this.findOne({email},projection)
}
UserSchema.methods.matches = function(password:string): boolean{
  return bcrypt.compareSync(password,this.password)
}
UserSchema.methods.hasAny = function(...profiles:string[]): boolean{
  return profiles.some(profile => this.profiles.indexOf(profile) !== -1 )
}
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

export default model<TUser,UserModel>('User', UserSchema)