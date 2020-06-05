import test from 'ava'
import { omit } from 'lodash'
import { User } from '../user.model'

test('user should have email', t => {
  const email = omit(User.schema.obj.email, 'validate')
  t.deepEqual(email, {
    type: String,
    required: true,
    trim: true,
    unique: true,
  })
})

test.cb('should reject a completely incorrect email', t => {
  const user = new User({ email: 'reee' })
  user.validate(err => {
    t.assert(err.errors.email.message, 'Email is not valid')
    t.end()
  })
})
