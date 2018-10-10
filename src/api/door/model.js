import mongoose, {Schema} from 'mongoose'

// http://mongoosejs.com/docs/schematypes.html
const doorSchema = new Schema({
    mac: {
        type: String,
        trim: true
    },
    doorNumber: {
        type: Number,
        trim: true
    },
    cards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Card'
    }
}, {
    timestamps: true
    // toJSON: {
    //     virtuals: true,
    //     transform: (obj, ret) => { delete ret._id }
    // }
})


doorSchema.methods = {
    view (type = 'list') {
        const full = {
            id: this.id,
            mac: this.mac,
            doorNumber: this.doorNumber,
            cards: this.cards
        }
        const list = {
            id: this.id,
            doorNumber: this.doorNumber,
            mac:this.mac
        }
        switch (type) {
            case 'list':
                return list;
            case 'full':
                return full;
            
        }
    }
}


const model = mongoose.model('Door', doorSchema)
export const schema = model.schema
export default model


