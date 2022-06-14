const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ComentarionSchema = Schema({
    text: { type: String, default: null},
    timestamp: { type: Date, default: Date.now },
    owner:  { type: Schema.Types.ObjectId, ref: 'Usuario' },
    publication: { type: Schema.Types.ObjectId, ref: 'Publicacion' }
},
{
    versionKey: false
});

ComentarionSchema.plugin(mongoosePaginate);

module.exports = model('Comentario', ComentarionSchema);