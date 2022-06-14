const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PublicacionSchema = Schema({
    text: { type: String, default: null},
    images: [{secure_url: String, public_id: String}],
    timestamp: { type: Date, default: Date.now },
    owner:  { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
{
    versionKey: false
});

PublicacionSchema.plugin(mongoosePaginate);

module.exports = model('Publicacion', PublicacionSchema);