const { response } = require("express");
const { ObjectId} = require("mongoose").Types;
const {Usuario, Categoria, Producto } = require('../models');
const categoria = require("../models/categoria");


const coleccionesPermitidas = ['usuarios','categorias','productos','roles'];

//BUSCAR USUARIOS
const buscarUsuarios = async( termino='', res= response ) =>{

    const esMongoId = ObjectId.isValid(termino); 

    if ( esMongoId ) {
        const usuario = await Usuario.findById(termino); 
        return res.json({
            results: (usuario) ? [usuario ] : []
        })
    }//FIN IF

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({ 
        $or: [{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });

    res.json({
        results: usuarios
    })

}//FIN BUSCAR USUARIOS

//BUSCAR CATEGORIAS
const buscarCategorias = async( termino='', res= response ) =>{
    const esMongoId = ObjectId.isValid(termino); 

    if ( esMongoId ) {
        const categoria = await Categoria.findById(termino); 
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }//FIN IF

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado:true});

    res.json({
        results: categorias
    })
}//FIN BUSCAR CATEGORIAS

//BUSCAR PRODUCTOS
const buscarProductos = async( termino='', res= response ) =>{

    const esMongoId = ObjectId.isValid(termino); 

    if ( esMongoId ) {
        const producto = await Producto.findById(termino)
                                        .populate('categoria','nombre'); 
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }//FIN IF

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado:true })
                                    .populate('categoria','nombre');

    res.json({
        results: productos
    })
}//FIN BUSCAR PRODUCTOS

//INICIO BUSQUEDA
const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params; 

    if(!coleccionesPermitidas.includes( coleccion )){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }//FIN IF

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino,res);
        break;
                
        default:
                res.status(500).json({
                    msg: 'Se le olvido hacer esta busqueda'
                });
    }//FIN SWITCH
}//FIN BUSCAR

module.exports = {
    buscar
}