const { response } = require("express");
const { subirArchivo } = require("../helpers");

//INICIO CARGA ARCHIVO
const cargarArchivo = async(req, res= response) => {
  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg:'No hay archivos que subir'});
      return;
    }//FIN IF

    try {
        const nombre = await subirArchivo(req.files,undefined,'imgs');
    res.json({nombre});
    } catch (msg) {
        res.status(400).json({msg});
    }


}//FIN CARGA ARCHIVO

module.exports = {
    cargarArchivo
}