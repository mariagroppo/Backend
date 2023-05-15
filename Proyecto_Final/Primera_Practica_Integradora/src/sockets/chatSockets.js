import MessageMongoDB from "../classes/mongodb/prodsMongoDB.js";
const chatMongo = new MessageMongoDB();

import db from '../classes/database.js';

export default function socketChat(socketServer){
    /* ON es el escuchador de eventos */
    socketServer.on('connection', async socket => {
        console.log('Un cliente se ha conectado al chat || ' + new Date().toLocaleString());
                
        let messages;
        if (db === 'fs') {
            
        } else {
            messages = await chatMongo.getAll();
        }
        socket.emit ('logs', messages.value);

        socket.on('msg', async msg=>{
            let answer;
            console.log(msg);
            if (db === 'fs') {

            } else {
                answer = await chatMongo.save(msg);
            }
            console.log(answer.value)
            /* messages.push(data); */
            let messages = await chatMongo.getAll();
            console.log(messages)
            socketServer.emit('logs', messages.value)
        })

        socket.on('authenticated', data=> {
            /* Notifico a todos menos a mi */
            socket.broadcast.emit('newUserConnected', data);
            /* users.push(data);
            console.log(users);
            socket.emit('users', users); */
        })

    })
}