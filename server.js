const { prototype } = require('events');
const express = require('express')
const connectDB = require('./config/db')

connectDB();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.send('API Running'))

io.on('connection', (socket) => {
    console.log('a user connected');
});
  
http.listen(3000, () => {
    console.log('listening on *:3000');
});

//middleware
app.use(express.json())
app.use(function (req, res, next) {
    req.io = io;
    next();
  });

//routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/message', require('./routes/api/message'));


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server stared on port ${PORT}`));


module.exports = app;