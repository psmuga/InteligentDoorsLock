import { success, notFound, win, fail } from '../../services/response/'
import { logger } from '../../services/winston'
let winston = require('winston');
import path from 'path'

import Doors from './model'
import Cards from '../card/model'
import Logs from '../log/model'

const populateOpt = {
    path: 'cards',
    model: 'Card',
    select: 'id mac doorNumber'
}

export const saveInfoOpenDoor = (req, res, next) => {
    const mac = req.params.mac
    

    Doors.findOne({ "mac" : mac}, function (err, door) {
            if (!door)
                return fail(res)(door);
            else
            {
                const files = new winston.transports.File({ filename: path.join(__dirname, '../../../logs/' + `${door.doorNumber}.txt`)})
                logger.add(files)
                logger.info("Open door from inside")

                let log = {
                    "door" : door.doorNumber,
                    "cardUID" : "",
                    "message" : "Open door from inside"
                }
                Logs.create(log)

                setTimeout(function(){
                    logger.remove(files);
                },1000);
                success(res)(door.view())
            }
            
    })

}

export const index = (req, res, next) => {
    return Doors.find()
        .populate(populateOpt)
        
        .then((doors) => doors.map((door) => door.view()))
        .then(success(res))
        .catch(next)
}

export const show = (req, res, next) => {
    const id = req.params.id
    return Doors.findById(id)
        .populate(populateOpt)
        .then((door) =>door ?door.view('full') : null)
        .then(success(res))
        .catch(notFound(res))
}

export const create = (req, res, next) => {
    const body = req.body
    Doors.create(body)
        .then((door) => Doors.populate(door,populateOpt))
        .then((door) => door.view('full'))
        .then(success(res))
        .catch(next)
}

export const update = (req, res, next) => {
    const id = req.params.id
    const body = req.body

    return Doors.findById(id)
        .then(notFound(res))
        .then((door) => door ? Object.assign(door, body).save() : null)
        .then((door) => door ? door.view('full') : null)
        .then(success(res))
        .catch(next)
}

export const destroy = (req, res, next) => {
    const id = req.params.id
    return Doors.findById(id)
        .then(notFound(res))
        .then((door) => door ? door.remove() : null)
        .then(success(res, 204))
        .catch(next)
}


export const check = (req, res, next) => {
    const cardNumber = req.params.cardNr
    const mac = req.params.mac
    

    Doors.findOne({ "mac" : mac}, function (err, door) {
            if (!door)
                return fail(res)(door);
        
            const files = new winston.transports.File({ filename: path.join(__dirname, '../../../logs/' + `${door.doorNumber}.txt`)})       
            logger.add(files)

            let log = {
                "door" : door.doorNumber,
                "cardUID" : cardNumber,
                "message" : ""
            }

                Cards.findOne({ "uid" : cardNumber}, function (err, card) {
                    if (!card)
                    {
                        log.message = "fail - attempt to open with bad card";
                        Logs.create(log)

                        logger.info('Fail - attempt to open with bad card: ' + cardNumber);
                        fail(res)(card);
                        return;
                    }
                      //check if door have this card  

                    let isWin = false
                    for(let i =0; i<door.cards.length;i++){
                        if(door.cards[i] == card.id)
                        {
                            log.message = "success opened using card";
                            Logs.create(log)

                            logger.info('Success opened using card: ' + cardNumber);
                            isWin =true
                            win(res)(card.view())
                            break;
                        }
                    }
                    if(!isWin ){
                        log.message = "fail - attempt to open door with wrong card";
                        Logs.create(log)

                        logger.info('Fail - attempt to open door with wrong card');
                        fail(res)(card);
                    }
                        
                    setTimeout(function(){
                        logger.remove(files);
                    },1000);
                   
                })
               
            //success(res)(door.view())
        })
}


export const searchByName = (req, res, next) => {
    const name = req.params.name

    Doors.findOne({ "doorNumber" :  name  },
        function (err, door) {
            if (!door)
                return notFound(res)(door);
            success(res)(door.view())
        })
}

export const count = (req, res, next) => {
    Doors.count({})
        .then((count) => ({count: count}))
        .then(success(res))
        .catch(next)
}

export const listcount = (req, res, next) => {
    Promise.all([
        Doors.find({})
            .then((doors) => doors.map((door) => door.view('full'))),
        Doors.count({})
    ]).then(([list, count]) => success(res)({list: list, count: count})).catch(next)
}

export const paginatedIndex = (req, res, next) => {
    // Call it as: http://localhost:9000/api/actors/index?limit=10&skip=1
    const limit = parseInt(req.query.limit) || 1000
    const skip = parseInt(req.query.skip) || 0

    return Doors.find()
        .limit(limit)
        .skip(skip)
        .sort(doorNumber)
        .then((doors) => doors.map((door) => door.view('full')))
        .then(success(res))
        .catch(next)

}