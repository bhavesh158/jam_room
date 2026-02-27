# 🎵 JamRoom

**Local Real-Time Voting Platform**

JamRoom is a lightweight, real-time local voting platform designed for teams connected to the same Wi-Fi network. It enables fast decision-making during meetings, hackathons, sprint retros, and informal office discussions.

## Features

- ✅ **No Internet Required** - Runs entirely on local network
- ✅ **No Authentication** - Join instantly, no signup needed
- ✅ **Real-Time Updates** - Live vote updates via WebSocket
- ✅ **Multi-Device Support** - Web browser and React Native Android app
- ✅ **Instant Setup** - Start voting in seconds

## Quick Start

### Server (Host Machine)

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will display the local network URL:
```
========================================
  🎵 JamRoom Server Started!
========================================
  Local:   http://localhost:3001
  Network: http://192.168.1.50:3001

  Share the Network URL with participants
  Press Ctrl+C to stop the server
========================================
```

### Web Client (Participants)

1. Open browser and navigate to the server URL (e.g., `http://192.168.1.50:3001`)
2. Create a poll or join existing session
3. Vote and see live results

### Mobile App (Android)

```bash
cd mobile

# Install dependencies
npm install

# Run on Android device/emulator
npm run android
```

1. Enter the server IP address (e.g., `192.168.1.50:3001`)
2. Connect to the session
3. Vote and view results

## Usage Flow

### Creating a Poll (Host)

1. Navigate to the server URL on your laptop
2. Enter poll question (e.g., "What should we order for lunch?")
3. Add 2-6 options
4. Click "Start Poll"
5. Share the URL with your team

### Voting (Participants)

1. Open the URL on your device (browser or app)
2. View the active poll
3. Select an option
4. Submit your vote
5. View live results

### Managing Poll (Host)

- **Start Poll** - Make the poll active for voting
- **End Poll** - Close voting (results still visible)
- **Reset Poll** - Delete current poll and start fresh

## Architecture

```
┌─────────────────┐
│   Host Laptop   │
│  (Node.js Server)│
│  - Express HTTP  │
│  - Socket.IO WS  │
└────────┬────────┘
         │
    Wi-Fi Network
         │
    ┌────┴────┬────────────┬──────────┐
    │         │            │          │
┌───▼──┐ ┌───▼──┐  ┌─────▼──┐  ┌───▼────┐
│Phone │ │Tablet│  │Laptop  │  │Android │
│Web   │ │Web   │  │Web     │  │App     │
└──────┘ └──────┘  └────────┘  └────────┘
```

## Tech Stack

### Backend
- Node.js
- Express
- Socket.IO

### Web Frontend
- Vanilla JavaScript
- Tailwind CSS
- Socket.IO Client

### Mobile App
- React Native
- Socket.IO Client
- React Navigation

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3001)

Example:
```bash
PORT=8080 npm start
```

## Troubleshooting

### Devices can't connect

1. Ensure all devices are on the **same Wi-Fi network**
2. Check firewall settings allow incoming connections on port 3001
3. Verify the correct IP address is being used

### Port already in use

Change the port:
```bash
PORT=3002 npm start
```

## Demo Plan

1. Start server on laptop
2. Share local IP with team
3. Everyone joins via browser or app
4. Create poll: "Snacks Party – Samosa, Kachori, Burger?"
5. Everyone votes
6. Watch live results update
7. Declare winner!

## License

ISC

---

**Built for hackathons. Made for quick decisions.** 🚀
