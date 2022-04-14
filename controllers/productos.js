const { response } = require('express');
const { Producto } =require('../models');

// OBTENER CATEGORIAS - PAGINADO - TOTAL - POPULATE 
const obtenerProductos = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado:true };
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate('usuario','nombre')
                .populate('categoria','nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ]);
    res.json( {total, productos} );
}//FIN OBTENER PRODUCTOS

//OBTIENE PRODUCTO
const obtenerProducto = async (req, res=response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
                                .populate('usuario','nombre')
                                .populate('categoria','nombre');
    res.json(producto);
}//FIN OBTENER PRODUCTO

//CREA EL PRODUCTO
const crearProducto = async (req, res=response ) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne( { nombre: body.nombre } );
    /*VERIFICA SI EXISTE EL PRODUCTO*/
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        });
    }//FIN IF

    //GENERAR LA DATA CON EL PRODUCTO A GUARDAR 
    const data = { 
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario:req.usuario._id,
         }
    const producto = new Producto( data );

    //GUARDAR EL PRODUCTO EN DB
    await producto.save();
    res.status(201).json(producto);
}//FIN CREAR PRODUCTO

//ACTUALIZA EL PRODUCTO
const actualizarProducto = async(req, res=response) =>{

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    if(data.nombre){
        data.nombre = data.nombre.toUpperCase(); //NOMBRE PRODUCTO
    }

    data.usuario = req.usuario._id; //NOMBRE USUARIO

    const producto = await Producto.findByIdAndUpdate(id,data,{ new:true });
    res.json(producto);
}//FIN ACTUALIZAR PRODUCTO

//ELIMINA EL PRODUCTO

const borrarProducto = async(req, res=response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado:false},{new:true});

    res.json(productoBorrado);

}//FIN BORRAR PRODUCTO


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}
