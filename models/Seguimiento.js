const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SeguimientoSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    followed: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
{
    timestamps: true,
    versionKey: false
});

SeguimientoSchema.plugin(mongoosePaginate);

module.exports = model('Seguimiento', SeguimientoSchema);