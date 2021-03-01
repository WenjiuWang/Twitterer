const { prototype } = require('events');
const express = require('express')
const connectDB = require('./config/db')

connectDB();

const app = express();

app.get('/', (req, res) => res.send('API Running'))

//middleware
app.use(express.json())

//routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
//app.use('/api/message', require('./routes/api/message'));


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server stared on port ${PORT}`));


module.exports = app;