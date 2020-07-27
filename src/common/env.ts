type Env = {
  server: {
    port: number|string
  },
  db:{
    url: number|string
  },
  apiSecret: string,
  log:{
    level: string,
    name: string
  }

}

export const env:Env = {
  server: { port: process.env.PORT||3000 },
  db: {url: process.env.PORT|| 'mongodb://localhost/meat-api'},
  apiSecret: process.env.API_SECRET || 'meat-api',
  log:{
   level: process.env.LOG_LEVEL || 'debug',
   name: 'meat-api-logger' 
  }
}