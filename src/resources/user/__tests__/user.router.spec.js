import test from 'ava'
import { userRouter } from '../user.router.js'

test('should have get route', t => {
  const route = { path: '/', method: 'get' }

  const match = userRouter.stack.find(
    s => s.route.path === route.path && s.route.methods[route.method]
  )
  t.assert(match)
})
