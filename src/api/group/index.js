import { Router } from 'express'
import {index, show, create, update, destroy, count, listcount, paginatedIndex, addCardToGroup } from './controller'
import {token} from "../../services/passport"

const router = new Router()

router.get('/count', count)
router.get('/list', listcount)
router.get('/index/:limit?/:skip?', paginatedIndex)

router.post('/addCard/:name/:puid', addCardToGroup)

// Start here
// Core examples - you need to have it in your project!
router.get('/', index)
router.get('/:id', show)
router.post('/',token({required: true, roles: ['admin']}), create)
router.put('/:id',token({required: true, roles: ['admin']}), update)
router.delete('/:id',token({required: true, roles: ['admin']}), destroy)


export default router