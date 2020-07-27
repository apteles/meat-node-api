import * as bunyan from 'bunyan'
import {env} from './env'
export const logger = bunyan.createLogger({
  name: env.log.name,
  level: (<any>bunyan).resolveLevel(env.log.level)
})