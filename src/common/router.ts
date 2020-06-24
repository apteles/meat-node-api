import {Server} from 'restify'
export default abstract class Router{
  abstract applyRoutes(application: Server):void
}