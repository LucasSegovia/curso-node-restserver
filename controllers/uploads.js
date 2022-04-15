
const path = require('path');
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');

//INICIO CARGA ARCHIVO
const cargarArchivo = async(req, res= response) => {
    try {
        const nombre = await subirArchivo(req.files,undefined,'imgs');
    res.json({nombre});
    } catch (msg) {
        res.status(400).json({msg});
    }
}//FIN CARGA ARCHIVO

//INICIO ACTUALIZAR IMAGEN
const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({ msg:`NO existe un usuario con el ID ${id}` });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({ msg:`NO existe un producto con el ID ${id}` });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }//FIN SWITCH

    //LIMPIAR IMG PREVIAS
    if(modelo.img){
       //HAY QUE BORRAR LA IMG DEL SERVER
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }//FIN IF FS
    }//FIN IF MODELO

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json({ modelo });

}//FIN ACTUALIZAR IMAGEN

//MOSTRAR IMAGEN
const mostrarImagen = async(req, res= response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({ msg:`NO existe un usuario con el ID ${id}` });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({ msg:`NO existe un producto con el ID ${id}` });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }//FIN SWITCH

    //LIMPIAR IMG PREVIAS
    if( modelo.img ){
       //HAY QUE BORRAR LA IMG DEL SERVER
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if ( fs.existsSync(pathImagen) ){
            return res.sendFile(pathImagen);
        }//FIN IF FS
    }//FIN IF MODELO IMG

    const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
    res.sendFile(pathImagen);


}//FIN MOSTRAR IMAGEN



//INICIO ACTUALIZAR IMAGEN
const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({ msg:`NO existe un usuario con el ID ${id}` });
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({ msg:`NO existe un producto con el ID ${id}` });
            }
        break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }//FIN SWITCH

    //LIMPIAR IMG PREVIAS
    if( modelo.img ){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
    }//FIN IF

        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        modelo.img = secure_url;
        await modelo.save();

    res.json({ modelo });

}//FIN ACTUALIZAR IMAGEN

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}