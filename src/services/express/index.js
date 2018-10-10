import express from 'express'
import bodyParser from 'body-parser'
import router from "../../api";
import cors from 'cors'

function errorHandler() {
    return function (err, req, res, next) {
        if (err) {
            res.status(400).json(err);
        } else {
            next(err);
        }
    };
}


export default (apiRoot, routes) => {
    const app = express()
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(apiRoot, routes)

    app.use(errorHandler())

    app.all('*', function(req, res){
        // res.send({error: true, message: 'Routing not found'}, 404);
        res.status(404).send({error: true, message: 'Routing not found'});
    });

    return app
}