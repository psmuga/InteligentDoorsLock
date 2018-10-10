import { Router } from 'express'
import { token } from '../../services/passport'
import { showMe, create, update, destroy } from './controller'
const router = new Router()

router.get('/me',
  token({ required: true }),
  showMe)

router.post('/',
  create)

router.put('/:id',
  token({ required: true}),
  update)

router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
