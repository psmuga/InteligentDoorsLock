import { Router } from 'express'
import {index, show, create, update, destroy,doorsByCard, searchByBrand,searchByEngineType, searchByAge, count, listcount, paginatedIndex} from './controller'
import {token} from "../../services/passport"

const router = new Router()

// Other examples - not necessary but can upgrade your mark
//router.get('/search/brand/:brand', searchByBrand)
//router.get('/search/enginetype/:type', searchByEngineType)
//?
//router.get('/search/production/:min/:max', searchByAge)


router.get('/count', count)
router.get('/list', listcount)
router.get('/index/:limit?/:skip?', paginatedIndex)
router.get('/:id/doors', doorsByCard)

// Start here
// Core examples - you need to have it in your project!
router.get('/', index)
router.get('/:id', show)
router.post('/',token({required: true, roles: ['admin']}), create)
router.put('/:id',token({required: true, roles: ['admin']}), update)
router.delete('/:id',token({required: true, roles: ['admin']}), destroy)


export default router