/* eslint-disable no-console */
/* eslint-disable import/order */
const express = require('express');
const path = require('path');
const routes = require('./routes');
const cors = require('cors');
// const {save} = require('./db/models.js')
const db = require('./db/index.js');

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
app.use(cors());

app.use('/', routes);

const server = app.listen(80, () => {
  console.log('Server is running at port 80');
});
const io = require('socket.io')(server);

const user = {};
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log(`${msg} from ${socket.id}`);
    io.emit('chat message', { name: user[socket.id], msg });
    // io.emit('chat message', msg);
  });

  socket.on('new-user', (name) => {
    user[socket.id] = name;
    // console.log('this is the name', user,name);
    io.emit('user-connected', name);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
