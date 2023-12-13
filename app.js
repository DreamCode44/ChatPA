const express = require('express');
const { createServer } = require("node:http/ChatPA/")
const path = require('path');
const cookie = require("cookie")
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Server } = require('socket.io');

const indexRouter = require('./routes/index/ChatPA/');

const app = express();
const server = createServer(app);
const io = new Server(server);
const users = {}
const doctors = {}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

io.on('connection', (socket) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    const username = cookies.usuario || "Anónimo"

    socket.emit("chat message", `Bienvenido, ${username}`)
    if (cookies.tipo === '2') {
        // Doctor
        doctors[username] = socket;
        socket.on('chat message', (msg) => {
            const parts = msg.split(" ")
            const recipientUsername = parts.shift()

            if (recipientUsername in users) {
                const userSocket = users[recipientUsername]
                userSocket.emit('chat message', `Doctor: ${parts.join(" ")}`);
                socket.emit('chat message', `Tú: ${parts.join(" ")}`);
            } else {
                socket.emit('chat message', "No se pudo entregar el mensaje al usuario.");
            }
        });
    } else {
        // Paciente
        users[username] = socket;
        socket.on('chat message', (msg) => {
            for (const doctorUsername in doctors) {
                if (Object.hasOwnProperty.call(doctors, doctorUsername)) {
                    const doctorSocket = doctors[doctorUsername];
                    doctorSocket.emit('chat message', `${username}: ${msg}`);
                }
            }
            socket.emit('chat message', `Tú: ${msg}`);
        });
    }
});

module.exports = { app, server };
