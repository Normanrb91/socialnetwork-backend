const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UsuarioSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {type: { secure_url: String, public_id: String }, default: null},
    biography: { type: String, default: null },
    status: { type: String, required: true, default: 'VERIFIED' }, //UNVERIFIED, VERIFIED, INACTIVE
    tokens: [ { token: {type: String } } ],
},
{
    timestamps: true,
    versionKey: false
});


UsuarioSchema.plugin(mongoosePaginate);

UsuarioSchema.method('toJSON', function(){
    const { password, tokens, ...object } = this.toObject();
    return object;
});

module.exports = model('Usuario', UsuarioSchema);