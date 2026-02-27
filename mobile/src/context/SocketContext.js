import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [poll, setPoll] = useState(null);
  const [clientCount, setClientCount] = useState(1);

  const connect = (serverAddress) => {
    return new Promise((resolve, reject) => {
      try {
        const newSocket = io(`http://${serverAddress}`, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
          setConnected(true);
          setSocket(newSocket);
          resolve(newSocket);
        });

        newSocket.on('disconnect', () => {
          setConnected(false);
        });

        newSocket.on('poll:update', (data) => {
          setPoll(data.poll);
        });

        newSocket.on('clients:update', (data) => {
          setClientCount(data.count);
        });

        newSocket.on('error', (data) => {
          console.error('Socket error:', data.message);
        });

        newSocket.on('connect_error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
      setPoll(null);
    }
  };

  const createPoll = (question, options) => {
    if (socket) {
      socket.emit('poll:create', { question, options });
    }
  };

  const submitVote = (optionId) => {
    if (socket) {
      socket.emit('vote:submit', { optionId });
    }
  };

  const startPoll = () => {
    if (socket) {
      socket.emit('poll:start');
    }
  };

  const endPoll = () => {
    if (socket) {
      socket.emit('poll:end');
    }
  };

  const resetPoll = () => {
    if (socket) {
      socket.emit('poll:reset');
    }
  };

  const value = {
    socket,
    connected,
    poll,
    clientCount,
    connect,
    disconnect,
    createPoll,
    submitVote,
    startPoll,
    endPoll,
    resetPoll,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
