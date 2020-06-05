import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: email => email.includes('@') && email.length > 3,
      message: 'Email is not valid'
    }
  }
})

export const User = mongoose.model('user', userSchema)
