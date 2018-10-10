let winston = require('winston');
import path from 'path'

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.json()
        
        
    ),
    transports:[
         new winston.transports.Console(),
        //new winston.transports.File({filename: path.join(__dirname, '../../../logs/log.txt'),})
    ]
});