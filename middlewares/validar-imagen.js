const fileUpload = require('express-fileupload');


const uploadImage = fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
})

module.exports = uploadImage;


// const multer = require('multer');
// const path  = require('path');
// const mime = require('mime');
// const shell = require('shelljs');

// const storage = multer.diskStorage({

//     destination: function(req, file, cb){
//         let destination =  path.join(__dirname, '../uploads');
//         const {id} = req.usuario;

//         shell.mkdir('-p', './uploads/' + id);
//         destination = path.join(destination, '', id);

//         cb(null, destination);
//     },

//     filename: function(req, file, cb) {
//         const { id } = req.usuario;
//         const { tipo } = req.params;

//         let ext = path.extname(file.originalname);
//         ext = ext.length > 1 ? ext : mime.extension(file.mimetype);

//         let fileName = '';
//         tipo === 'perfil' 
//             ? fileName = `${ id }-${ tipo }${ ext }` 
//             : fileName = `${ id }-${ new Date().getTime() }${ ext }`;
        
//         cb(null, fileName);
//     }
// });

// const uploadImage = multer({
//     storage, 
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('El archivo no corresponde a una imagen'))
//         }
//         cb(undefined, true)
//     }
// }).single('image'); 