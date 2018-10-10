import { success, notFound } from '../../services/response/'
import Groups from './model'
import Doors from '../door/model'

export const addCardToGroup = (req, res, next) => {
    const puid = req.params.puid;
    const name = req.params.name;

    Groups.findOne({ "name" :  name  }, function (err, group) {
        if (!group)
            return notFound(res)(group);
            let body;
        for(let i = 0 ; i <group.doors.length; i++) {
            
            var ind = i;
            Doors.findById(group.doors[ind], function(err, door){
                if(!door)
                    return notFound(res)(door);
                console.log(door.doorNumber);
                door.cards.push(puid);
                body = door;
            //} )
            //     body = door;
            //     body.cards.push(puid)
                Object.assign(door, body).save(); 
            } ) 
             //}).then((dr) => dr ? Object.assign(dr, body).save() : null).then(body ="")
            
        }


        success(res)(group.view())
    })
    
}

export const index = (req, res, next) => {
    return Groups.find()
        .then((groups) => groups.map((group) => group.view()))
        .then(success(res))
        .catch(next)
}

export const show = (req, res, next) => {
    const id = req.params.id
    return Groups.findById(id).exec()
        .then((group) => group ? group.view('full') : null)
        .then(success(res))
        .catch(notFound(res))
}

export const create = (req, res, next) => {
    const body = req.body
    Groups.create(body)
        .then((group) => group.view('full'))
        .then(success(res))
        .catch(next)
}

export const update = (req, res, next) => {
    const id = req.params.id
    const body = req.body

    return Groups.findById(id)
        .then(notFound(res))
        .then((group) => group ? Object.assign(group, body).save() : null)
        .then((group) =>group ? group.view('full') : null)
        .then(success(res))
        .catch(next)
}

export const destroy = (req, res, next) => {
    const id = req.params.id
    return Groups.findById(id)
        .then(notFound(res))
        .then((group) => group ? group.remove() : null)
        .then(success(res, 204))
        .catch(next)
}



export const count = (req, res, next) => {
    Groups.count({})
        .then((count) => ({count: count}))
        .then(success(res))
        .catch(next)
}

export const listcount = (req, res, next) => {
    Promise.all([
        Groups.find({})
            .then((groups) => groups.map((group) => group.view())),
        Groups.count({})
    ]).then(([list, count]) => success(res)({list: list, count: count})).catch(next)
}

export const paginatedIndex = (req, res, next) => {
    // Call it as: http://localhost:9000/api/actors/index?limit=10&skip=1
    const limit = parseInt(req.query.limit) || 1000
    const skip = parseInt(req.query.skip) || 0

    return Groups.find()
        .limit(limit)
        .skip(skip)
        .sort(name)
        .then((groups) => groups.map((group) => group.view('full')))
        .then(success(res))
        .catch(next)

}

