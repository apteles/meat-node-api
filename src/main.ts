import {Server} from './server/server'
import usersRouter from './users/users.router'

const routes = [
  usersRouter
];

const server = new Server
server.bootstrap(routes).then((server) => {
  console.log('Console is running on port: ',server.application.address())
}).catch(err => {
  console.log('fail to start server:' ,err);
  process.exit(1)
})
