const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths={
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios',
        }

        
        //CONECTAR A BASE DE DATOS
        this.conectarDB(); 
        //MIDDLEWARES
        this.middlewares();
        //RUTAS DE MI APP
        this.routes();
    }//FIN CONSTRUCTOR
    
    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );
        //LECTURA Y PARSEO DEL BODY
        this.app.use( express.json() );
        //DIRECTORIO PUBLICO
        this.app.use( express.static('public') );

        //FILEUPLOADS - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));

    }//FIN MIDD

    routes(){
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.productos,require('../routes/productos'));
        this.app.use(this.paths.uploads,require('../routes/uploads'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
    }//FIN ROUTES

    listen(){
        this.app.listen(this.port,()=>{
        console.log('Servidor corriendo en puerto',this.port);
        });
    }

}//FIN SERVER

module.exports = Server;