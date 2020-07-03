import test from 'ava'
import request from 'supertest'
import { app } from '../server'

test.cb('should return json from route', t => {
  request(app)
    .get('/api/user')
    .expect('Content-Type', /json/)
    .expect(200, t.end)
})
