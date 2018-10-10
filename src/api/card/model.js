import mongoose, {Schema} from 'mongoose'

// http://mongoosejs.com/docs/schematypes.html
const cardSchema = new Schema({
    owner: {
        type: String,
        trim: true
    },
    uid: {
        type: String,
        trim: true
    },
    expiryDate: {
        type: Date,
        trim: true
    }
}, {
    timestamps: true,
    // toJSON: {
    //     virtuals: true,
    //     transform: (obj, ret) => { delete ret._id }
    // }
})


cardSchema.methods = {
    view (type = 'list') {

        switch (type) {
            case 'list':
                // simple view
                return {
                    id: this.id,
                    uid: this.uid            
                }
            default:
                // full view
                return {
                    id: this.id,
                    uid: this.uid,
                    owner: this.owner,
                    expiryDate: this.expiryDate
                }
        }
    }
}


const model = mongoose.model('Card', cardSchema)
export const schema = model.schema
export default model


