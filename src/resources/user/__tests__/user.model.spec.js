import test from 'ava'
import sinon from 'sinon'
import bcrypt from 'bcrypt'
import { omit } from 'lodash'
import { User } from '../user.model'
import { closeDatabase, connect } from '../../../../test/db-helpers'

test.before(async () => connect())
test.after(async () => closeDatabase())

test('user should have email', t => {
  const email = omit(User.schema.obj.email, 'validate')
  t.deepEqual(email, {
    type: String,
    required: true,
    trim: true,
    unique: true
  })
})

test.cb('should reject email without a @ character', t => {
  const user = new User({ email: 'reee' })
  user.validate(err => {
    t.assert(err.errors.email.message, 'Email is not valid')
    t.end()
  })
})

test.cb('should reject email with incorrect characters in domain part', t => {
  const user = new User({ email: 'reee@&~~' })
  user.validate(err => {
    t.assert(err.errors.email.message, 'Email is not valid')
    t.end()
  })
})

test.cb('should accept email with correct characters in domain part', t => {
  const user = new User({ email: 'reee@my-w0nderful-domain.com' })
  user.validate(err => {
    t.falsy(err.errors.email)
    t.end()
  })
})

test.cb('should reject email if it is longer than 255 characters', t => {
  const user = new User({ email: 'reeeeeeeeeeeeee@my----------------------------------------------------------------------------w0nderful-domain.commy------------------------------------------------------------------------------------------------------------------------w0nderful-domain.com' })
  user.validate(err => {
    t.assert(err.errors.email.message, 'Email is not valid')
    t.end()
  })
})

test.cb('should reject email if local part is longer than 63 characters', t => {
  const user = new User({ email: 'reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee@gmail.com' })
  user.validate(err => {
    t.assert(err.errors.email.message, 'Email is not valid')
    t.end()
  })
})

test('user should have password', t => {
  const email = User.schema.obj.password
  t.deepEqual(email, {
    type: String,
    required: true
  })
})

test('password should be hashed before saving', async t => {
  const password = 'password'
  const saltRounds = 8
  const salt = await bcrypt.genSalt(saltRounds)
  const encryptedPassword = await bcrypt.hash(password, salt)

  const hashFn = bcrypt.hash;
  sinon.stub(bcrypt, 'hash').callsFake(pw => hashFn(pw, salt))
  const user = await User.create({ email: 'info@example.com', password });
  t.deepEqual(user.password, encryptedPassword)
})
