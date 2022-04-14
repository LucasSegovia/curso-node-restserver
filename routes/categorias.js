const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const  router = Router();

//OBTENER TODAS LAS CATEGORIAS - publico
router.get('/', obtenerCategorias);

//OBTENER una categoria por ID  - publico
router.get('/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

//crear una categoria - privado - token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//ACTUALIZAR REGISTRO - CON TOKEN VALIDO
router.put('/:id',
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
,actualizarCategoria);

//BORRAR CATEGORIA SOLO ADMIN /CAMBIAR ESTADO DE TRUE A FALSE
router.delete('/:id',
        validarJWT,
        esAdminRole,
        check('id','No es un id de Mongo válido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
,borrarCategoria);


module.exports = router;