import test from 'ava'
import sinon from 'sinon'
import { get } from '../user.controllers'

test('should return user', t => {
  const send = sinon.fake()
  const res = { send }
  get({}, res)
  t.assert(send.calledWith({ email: 'hello@test.com' }))
})
