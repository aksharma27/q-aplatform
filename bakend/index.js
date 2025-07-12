const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers', require('./routes/answer'));
app.use('/api/notifications', require('./routes/notification'));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
app.set('io', io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
