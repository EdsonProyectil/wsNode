// io();
const socket = io();

// DOM Elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

btn.addEventListener('click',function(){

    // Aqui se envia la informacion del cliente al servidor
    socket.emit('chat:message',{
        username: username.value,
        message: message.value        
    });

    // console.log({
    //     username: username.value,
    //     message: message.value
    // });
});

message.addEventListener('keypress', function(){
    socket.emit('chat:typing', username.value);
});

// Aqui el cliente ESCUCHA (recibe) la accion del index.js (servidor)
socket.on('chat:message', function (data){
    console.log(data);

    actions.innerHTML = '';
    output.innerHTML += `<p>
        <strong>${data.username}</strong>: ${data.message}
    </p>`;

}); 

socket.on('chat:typing', function (data){
    // console.log(data);

    actions.innerHTML = `<p>
        <em>${data} id typing a message</em>
    </p>`;

}); 


