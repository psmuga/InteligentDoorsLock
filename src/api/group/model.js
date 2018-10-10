import mongoose, {Schema} from 'mongoose'

// http://mongoosejs.com/docs/schematypes.html
const groupSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    doors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Door'
    }
}, {
    timestamps: true,
    // toJSON: {
    //     virtuals: true,
    //     transform: (obj, ret) => { delete ret._id }
    // }
})


groupSchema.methods = {
    view (type = 'list') {

        switch (type) {
            case 'list':
                // simple view
                return {
                    id: this.id,
                    name: this.name           
                }
            default:
                // full view
                return {
                    id: this.id,
                    name: this.name,
                    doors: this.doors
                }
        }
    }
}


const model = mongoose.model('Group', groupSchema)
export const schema = model.schema
export default model


