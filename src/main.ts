import {Server} from './server/server'

const server = new Server
server.bootstrap().then((server) => {
  console.log('Console is running on port: ',server.application.address())
}).catch(err => {
  console.log('fail to start server:' ,err);
  process.exit(1)
})
