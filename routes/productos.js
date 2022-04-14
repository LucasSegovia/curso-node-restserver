const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const  router = Router();

//OBTENER TODAS LAS CATEGORIAS - publico
router.get('/', obtenerProductos);

//OBTENER una categoria por ID  - publico
router.get('/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto);

//crear una categoria - privado - token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','NO es un ID de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//ACTUALIZAR REGISTRO - CON TOKEN VALIDO
router.put('/:id',
    validarJWT,
    check('producto','NO es un ID de Mongo').not().isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
,actualizarProducto);

//BORRAR CATEGORIA SOLO ADMIN /CAMBIAR ESTADO DE TRUE A FALSE
router.delete('/:id',
        validarJWT,
        esAdminRole,
        check('id','No es un id de Mongo válido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos
,borrarProducto);

module.exports = router;