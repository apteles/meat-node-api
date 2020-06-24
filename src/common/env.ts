type Env = {
  server: {
    port: number|string
  }
}

export const env:Env = {
  server: { port: process.env.PORT||3000 }
}