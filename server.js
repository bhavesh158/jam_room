const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

// In-memory state
let currentPoll = null;
const votes = {}; // clientId -> optionId
const connectedClients = {};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API: Get current poll state
app.get('/api/poll', (req, res) => {
  res.json({ poll: currentPoll });
});

// API: Get server info
app.get('/api/info', (req, res) => {
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';
  
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        localIp = config.address;
        break;
      }
    }
  }
  
  res.json({ localIp, port: PORT });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const clientId = socket.id;
  connectedClients[clientId] = {
    id: clientId,
    connectedAt: new Date(),
    hasVoted: votes[clientId] ? true : false
  };

  console.log(`Client connected: ${clientId}`);
  
  // Send current poll state to new client
  socket.emit('poll:update', { poll: currentPoll });
  
  // Broadcast client count update
  io.emit('clients:update', { count: Object.keys(connectedClients).length });

  // Handle poll creation
  socket.on('poll:create', (data) => {
    const { question, options } = data;
    
    if (!question || !options || options.length < 2) {
      socket.emit('error', { message: 'Invalid poll data' });
      return;
    }

    currentPoll = {
      question,
      options: options.map((text, index) => ({
        id: index + 1,
        text,
        votes: 0
      })),
      isActive: true
    };

    // Reset votes
    Object.keys(votes).forEach(key => delete votes[key]);
    
    console.log(`Poll created: ${question}`);
    io.emit('poll:update', { poll: currentPoll });
  });

  // Handle vote submission
  socket.on('vote:submit', (data) => {
    const { optionId } = data;
    
    if (!currentPoll || !currentPoll.isActive) {
      socket.emit('error', { message: 'No active poll' });
      return;
    }

    const option = currentPoll.options.find(o => o.id === optionId);
    if (!option) {
      socket.emit('error', { message: 'Invalid option' });
      return;
    }

    // Remove previous vote if exists
    if (votes[clientId]) {
      const prevOption = currentPoll.options.find(o => o.id === votes[clientId]);
      if (prevOption) {
        prevOption.votes--;
      }
    }

    // Add new vote
    votes[clientId] = optionId;
    option.votes++;
    connectedClients[clientId].hasVoted = true;

    console.log(`Vote from ${clientId}: Option ${optionId}`);
    
    // Broadcast updated results
    io.emit('poll:update', { poll: currentPoll });
  });

  // Handle poll start
  socket.on('poll:start', () => {
    if (currentPoll) {
      currentPoll.isActive = true;
      io.emit('poll:update', { poll: currentPoll });
    }
  });

  // Handle poll end
  socket.on('poll:end', () => {
    if (currentPoll) {
      currentPoll.isActive = false;
      io.emit('poll:update', { poll: currentPoll });
    }
  });

  // Handle poll reset
  socket.on('poll:reset', () => {
    currentPoll = null;
    Object.keys(votes).forEach(key => delete votes[key]);
    io.emit('poll:update', { poll: null });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove vote if exists
    if (votes[clientId] && currentPoll) {
      const option = currentPoll.options.find(o => o.id === votes[clientId]);
      if (option) {
        option.votes--;
      }
      delete votes[clientId];
    }
    
    delete connectedClients[clientId];
    
    console.log(`Client disconnected: ${clientId}`);
    io.emit('clients:update', { count: Object.keys(connectedClients).length });
    if (currentPoll) {
      io.emit('poll:update', { poll: currentPoll });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';
  
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        localIp = config.address;
        break;
      }
    }
  }
  
  console.log('\n========================================');
  console.log('  🎵 JamRoom Server Started!');
  console.log('========================================');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${localIp}:${PORT}`);
  console.log('\n  Share the Network URL with participants');
  console.log('  Press Ctrl+C to stop the server');
  console.log('========================================\n');
});
