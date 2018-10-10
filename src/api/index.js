import { Router } from 'express'
import card from './card'
import door from './door'
import user from './user'
import auth from './auth'
import group from './group'

const router = new Router()

router.use('/cards', card)
router.use('/doors', door)
router.use('/groups', group)

router.use('/user',user)
router.use('/auth',auth)

export default router
