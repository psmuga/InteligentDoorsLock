import { success, notFound } from '../../services/response/'
import Cards from './model'
import Doors from '../door/model'

export const index = (req, res, next) => {
    return Cards.find()
        .then((cards) => cards.map((card) => card.view()))
        .then(success(res))
        .catch(next)
}

export const show = (req, res, next) => {
    const id = req.params.id
    return Cards.findById(id).exec()
        .then((card) => card ? card.view('full') : null)
        .then(success(res))
        .catch(notFound(res))
}

export const create = (req, res, next) => {
    const body = req.body
    Cards.create(body)
        .then((card) => card.view('full'))
        .then(success(res))
        .catch(next)
}

export const update = (req, res, next) => {
    const id = req.params.id
    const body = req.body

    return Cards.findById(id)
        .then(notFound(res))
        .then((card) => card ? Object.assign(card, body).save() : null)
        .then((card) => card ? card.view('full') : null)
        .then(success(res))
        .catch(next)
}

export const destroy = (req, res, next) => {
    const id = req.params.id
    return Cards.findById(id)
        .then(notFound(res))
        .then((card) => card ? card.remove() : null)
        .then(success(res, 204))
        .catch(next)
}


// ---

export const searchByBrand = (req, res, next) => {
    const brand = req.params.brand

    Cars.findOne({ "brand" : { $regex: new RegExp(`${brand}`, 'i') } },
        function (err, car) {
            if (!car)
                return notFound(res)(car);
            success(res)(car.view())
        })
}
export const searchByEngineType = (req, res, next) => {
    const engineType = req.params.type

    Cars.findOne({ "engineType" : { $regex: new RegExp(`${engineType}`, 'i') } },
        function (err, car) {
            if (!car)
                return notFound(res)(car);
            success(res)(car.view())
        })
}


export const searchByAge = (req, res, next) => {
    const min = new Date(req.params.min)
    const max = new Date(req.params.max)

    Cars.find({
            'production' : { $lte :  max, $gte :  min},
        })
        .then((cars) => cars.map((car) => car.view('full')))
        .then(success(res))
        .catch(next)
}

export const count = (req, res, next) => {
    Cards.count({})
        .then((count) => ({count: count}))
        .then(success(res))
        .catch(next)
}

export const listcount = (req, res, next) => {
    Promise.all([
        Cards.find({})
            .then((cards) => cards.map((card) => card.view())),
        Cards.count({})
    ]).then(([list, count]) => success(res)({list: list, count: count})).catch(next)
}

export const paginatedIndex = (req, res, next) => {
    // Call it as: http://localhost:9000/api/actors/index?limit=10&skip=1
    const limit = parseInt(req.query.limit) || 1000
    const skip = parseInt(req.query.skip) || 0

    return Cards.find()
        .limit(limit)
        .skip(skip)
        .sort(doorNumber)
        .then((cards) => cards.map((card) => card.view('full')))
        .then(success(res))
        .catch(next)

}

export const doorsByCard = (req, res, next) => {
    const id = req.params.id
    Cards.findById(id).exec(function(err, card){
        Doors.find()
            .where('cards').in([card.id])
            .then((doors) => doors.map((door)=>door.view('list')))
            .then(success(res))
            .catch(next)
    })
}