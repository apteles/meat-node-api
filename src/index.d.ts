import {TUser} from './users/users.model'

declare module 'restify'{
  export interface Request{
    authenticated: TUser
  }
}