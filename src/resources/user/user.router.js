import { Router } from 'express'
import { get } from './user.controllers'

export const userRouter = Router()

userRouter.route('/').get(get)

