import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: validateEmail,
      message: 'Email is not valid'
    }
  },
  password: {
    type: String,
    required: true
  }
})

function validateEmail(email) {
  const [local, domain] = email.split('@')
  return (
    email.includes('@') &&
    email.length < 255 &&
    local.length < 64 &&
    !domain.match(/[^a-zA-Z0-9\-.]/)
  )
}

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    this.password = await bcrypt.hash(this.password, 8)
    next()
  } catch (err) {
    next(err)
  }
})

export const User = mongoose.model('user', userSchema)
