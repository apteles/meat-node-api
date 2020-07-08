import 'jest'
import * as request from 'supertest'
import {Server} from '../server/server'
import {env} from '../common/env'
import Users from '../users/users.model'
import usersRouter from '../users/users.router'

const BASE_URL = "http://localhost:3001"

let server:Server

beforeAll( async () => {
  env.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
  env.server.port = process.env.SERVER_PORT || 3001

  server = new Server;
  try {
    await server.bootstrap([usersRouter]).catch(console.error);
    await Users.remove({})
  } catch (error) {
    console.log(error);
     
  }
  
})

test('GET /users', async () => {

  const response = await request(BASE_URL).get('/users')
  expect(response.status).toBe(200)
  expect(response.body.items).toBeInstanceOf(Array)
})

test('POST /users', async () => {
  const response = await request(BASE_URL).post('/users').send({ 
    name: 'usuario1',
    email: 'usuario1@email.com',
    password: '123456' 
  })
  expect(response.status).toBe(200)
  expect(response.body._id).toBeDefined()
  expect(response.body.name).toBe('usuario1')
  expect(response.body.email).toBe('usuario1@email.com')
  expect(response.body.password).toBeUndefined()
})

test('GET /users/invalid_id should return status 404', async () => {

  const response = await request(BASE_URL).get('/users/invalid_id')
  expect(response.status).toBe(404)
})

test('path /users/:id', async () => {
  let response = await request(BASE_URL).post('/users').send({ 
    name: 'usuario1',
    email: 'usuario2@email.com',
    password: '123456' 
  })
  let responseUser = await request(BASE_URL).patch(`/users/${response.body._id}`).send({name: 'usuario1 (updated)'}) 

  expect(responseUser.status).toBe(200)
  expect(responseUser.body._id).toBeDefined()
  expect(responseUser.body.name).toBe('usuario1 (updated)')
  expect(responseUser.body.email).toBe('usuario2@email.com')
  expect(responseUser.body.password).toBeUndefined()
})


afterAll( async ()=>{
  await server.shutdown()
})