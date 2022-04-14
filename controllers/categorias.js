const { response } = require('express');
const { Categoria } = require('../models');



// OBTENER CATEGORIAS - PAGINADO - TOTAL - POPULATE 
const obtenerCategorias = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado:true };
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                .populate('usuario','nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ]);
    res.json( {total, categorias} );
}//FIN OBTENER CATEGORIAS

//OBTIENE CATEGORIA
const obtenerCategoria = async (req, res=response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    res.json(categoria);
}//FIN OBTENER CATEGORIA SIMPLE

//CREA LA CATEGORIA
const crearCategoria = async (req, res=response ) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    //GENERAR LA DATA A GUARDAR 
    const data = {nombre,usuario: req.usuario._id}
    const categoria = new Categoria( data );

    //GUARDAR EN DB
    await categoria.save();
    res.status(201).json(categoria);
}//FIN CREAR CATEGORIA

//ACTUALIZA LA CATEGORIA
const actualizarCategoria = async(req, res=response) =>{

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase(); //NOMBRE PRODUCTO
    data.usuario = req.usuario._id; //NOMBRE USUARIO

    const categoria = await Categoria.findByIdAndUpdate(id,data,{ new:true });
    res.json(categoria);
}//FIN ACTUALIZAR

//ELIMINA LA CATEGORI

const borrarCategoria = async(req, res=response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado:false},{new:true});

    res.json(categoriaBorrada);

}//FIN BORRAR CATEGORIA




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}