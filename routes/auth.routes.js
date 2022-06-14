const {Router} = require('express');
const {check} = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarjwt } = require('../middlewares/validar-jwt');
const { 
    crearUsuario, 
    loginUsuario, 
    logoutUsuario, 
    logoutAllUsuarios, 
    verificarUsuario, 
    eliminarUsuario, 
    validarTokenUsuario } = require('../controllers/auth');

const router = Router();

//Rutas de Auth - host + api/auth

router.post('/new', 
    [
        check('name', 'El name es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de contener almenos 6 caracteres').isLength({min: 6}),
        validarCampos,
    ],
    crearUsuario);

router.post('/login',
    [
        check('email', 'El email debe ser valido').isEmail(),
        check('password', 'El password debe de contener almenos 6 caracteres').isLength({min: 6}),
        validarCampos,
    ], 
    loginUsuario);

router.get('/logout', validarjwt, logoutUsuario);

router.get('/logoutAll', validarjwt, logoutAllUsuarios);

router.get('/verify/:token', verificarUsuario);

router.delete('/delete', validarjwt, eliminarUsuario);

router.get('/checkToken', validarjwt, validarTokenUsuario)

module.exports = router;
    