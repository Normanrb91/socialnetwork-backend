const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const LikeSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    publication: { type: Schema.Types.ObjectId, ref: 'Publicacion' }
},
{
    versionKey: false
});

LikeSchema.plugin(mongoosePaginate);

module.exports = model('Like', LikeSchema);