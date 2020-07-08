type Env = {
  server: {
    port: number|string
  },
  db:{
    url: number|string
  },
  apiSecret: string

}

export const env:Env = {
  server: { port: process.env.PORT||3000 },
  db: {url: process.env.PORT|| 'mongodb://localhost/meat-api'},
  apiSecret: process.env.API_SECRET || 'meat-api'
}