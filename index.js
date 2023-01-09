// -- Este es el archvio de servidor --

const path = require('path');
const express = require('express');
const app = express();

//Settings
app.set('port', process.env.PORT || 8080);
// app.set('port', 80);

// Static Files
// console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));   

// Start the server
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

// WebSockets
const SocketIO = require('socket.io');
const { SocketAddress } = require('net');
const io = SocketIO(server);

io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    // Aqui el servidor ESCUCHA (recibe) la accion del chat.js (cliente)
    // En teoria aqui iria el PHP ----
    socket.on('chat:message', (data) => {

        // --------------------------------------------------------------------
        // -----  Aqui se envia la informacion del servidor al cliente  -------
        // --------------------------------------------------------------------
    
        // La informacion recibida se transforma en un arreglo
        var arreglo;
        var action;
        var id;
        var type;
        var value;

        // ----- AQUI SE COMPRUEBA SI LA CADENA DE CARACTERES INSERTADA ES UN JSON ------
        try {
            arreglo = JSON.parse(data.message);
            action  = arreglo['action'];
            id      = arreglo['id'];
            type    = arreglo['type'];
            value   = arreglo['value'];
        } catch (e) {
            action = "cannotJSON";
            id = -1;
            type = -1;            
        }

        // ----- AQUI SE COMPRUEBA SI EXISTE UN VALOR ------
        if(value === undefined){
            value = '';
        }else{
            value = arreglo['value'];
            value = value.trim();
        }

        // ----- AQUI SE COMPRUEBA SI EXISTEN LAS DEMAS VARIABLES ------
        if(action === undefined || id === undefined || type === undefined){
            action = 0;
            id = 0;
            type = 0;
        }

        switch(action){

            // ---------- ESTAS SON LAS FUNCIONES DEL WEBSERVICE ----------
            case "setTimer":
                if(value != ''){
                    if(type == "TEMP" || type == "ENERGY"){
                        if(!isNaN(value)){
    
                            var resultado = setTimer(id, type, value);
                            console.log(resultado);

                            io.sockets.emit('chat:message', {
                                username: data.username,
                                message: resultado
                            });
    
                        }else{
                            console.log("Error F-002. Debes insertar un valor numérico.");
                        }
                    }else{
                        console.log("Error SE-001. Los sensores aceptados son: 'TEMP' y 'ENERGY'.");
                    } 
                }else{
                    console.log("Error F-003. Inserta un valor, ejemplo:  value = 10 .");
                }
            break;
    
            case "setStatus":
                if(value != ''){
                    if(type == "DOOR"){
                        if(!isNaN(value)){
                            if(value == 0 || value == 1){

                                var resultado = setStatus(id, type, value);
    
                                io.sockets.emit('chat:message', {
                                    username: data.username,
                                    message: resultado
                                });

                            }else{
                                console.log("Error F-002. Solo puedes insertar '0' ó '1'.");
                            }
                        }else{
                            console.log("Error F-002. Debes insertar un valor numérico.");
                        }
                    }else{
                        console.log("Error SE-001. El sensor aceptado es: 'DOOR'.");
                    }
                }else{
                    console.log("Error F-003. Inserta un valor, ejemplo:  value = 1 .");
                }
            break;  
    
            // -- Casos para consultar datos ----------
            // ----------------------------------------
            case "getTemp":
                if(type == "TEMP"){

                    var resultado = getTemp(id, type);
    
                    io.sockets.emit('chat:message', {
                        username: data.username,
                        message: resultado
                    });
    
                }else{
                    console.log("Error SE-001. El sensor aceptado es: 'TEMP'.");
                }         
            break;
    
            case "getTimer":
                if(type == "TEMP" || type == "ENERGY"){

                    var resultado = getTimer(id, type);
                    
                    io.sockets.emit('chat:message', {
                        username: data.username,
                        message: resultado
                    });
    
                }else{
                    console.log("Error SE-001. Los sensores aceptados son: 'TEMP' y 'ENERGY'.");
                }
            break;
    
            case "getStatus":
                if(type == "ENERGY" || type == "DOOR"){

                    var resultado = getStatus(id, type);
                    
                    io.sockets.emit('chat:message', {
                        username: data.username,
                        message: resultado
                    });
                }else{
                    console.log("Error SE-001. Los sensores aceptados son: 'ENERGY' y 'DOOR'.");
                }
    
            break;            
                
            case "cannotJSON":
                console.log("El elemento agregado no es un JSON");
                break;

            // case "alive":
            //     call_user_func('alive', $id, $type);
            // break;

            default:
                console.log("Error SE-003. Esta accion no existe.");
        }

    });

    // Emitir a todos -----
    // socket.on('chat:typing', (data) =>{
    //     console.log(data);
    // });

    // Emitir a todos excepto al usuario que envia el dato --
    socket.on('chat:typing', (data) =>{
        socket.broadcast.emit('chat:typing', data);
    });
});


    // -------------------------------------
    // ------------- FUNCIONES -------------
    // -------------------------------------

    // TEMPERATURA
    function getTemp(id, type){
        var random = Math.random() * (45 - 1) + 1;
        value = parseFloat(random/10); // Este dato se obtiene de la electronica, este es un valor provisional.

        // Aqui debe existir una funcion que devuelva el valor a la electronica -----

        var datos = {
            "id": id,
            "type": type,
            "value": value,
        }

        return datos;
    }
        // tambien Corriente
    function setTimer(id, type, value){

        // Aqui debe existir una funcion que inserte el valor a la electronica -----
        
        var datos = {
            "id": id,
            "type": type,
            "value": value,
        }

        return datos;
    }

    function getTimer(id, type){
        
        value = 10; // Este dato se obtiene de la electronica, este es un valor provisional.
        
        // Aqui debe existir una funcion que devuelva el valor a la electronica -----

        var datos = {

            "id": id,
            "type": type,
            "value": value
        }
        
        return datos;
    }
    
    // PUERTA

        // tambien Corriente
    function getStatus(id, type){

        value = 1; // Este dato se obtiene de la electronica, este es un valor provisional.

        if(type == "DOOR"){
            // Aqui debe existir una funcion que devuelva el valor a la electronica -----
        }

        if(type == "ENERGY"){    
            // Aqui debe existir una funcion que devuelva el valor a la electronica -----
        }

        var datos = {
            "id": id,
            "type": type,
            "value": value
        }
        
        return datos;
    }

    function setStatus(id, type, value){

        if(type == "DOOR"){
            // Aqui debe existir una funcion que inserte el valor a la electronica -----
        }

        var datos = {
            "id": id,
            "type": type,
            "value": value
        }

        return datos;
    }
