import mongoose, {Schema} from 'mongoose'

// http://mongoosejs.com/docs/schematypes.html
const logSchema = new Schema({
    door: {
        type: Number,
        trim: true
    },
    cardUID: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    // toJSON: {
    //     virtuals: true,
    //     transform: (obj, ret) => { delete ret._id }
    // }
})


logSchema.methods = {
    view (type = 'list') {

        switch (type) {
            case 'list':
                // simple view
                return {
                    doorID: this.doorID,
                    cardUID: this.cardUID,
                    message: this.message           
                }
            default:
                // full view
                return {
                    doorID: this.doorID,
                    cardUID: this.cardUID,
                    message: this.message
                }
        }
    }
}


const model = mongoose.model('log', logSchema)
export const schema = model.schema
export default model


