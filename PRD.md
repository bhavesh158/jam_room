# JamRoom – Local Real-Time Voting Platform

## 1. Overview

JamRoom is a lightweight, real-time local voting platform designed for teams connected to the same Wi-Fi network.

It enables fast decision-making during meetings, hackathons, sprint retros, and informal office discussions.

JamRoom runs entirely on a local network without requiring internet access or external backend infrastructure.

Participants can join using:
- A web browser (primary interface)
- A React Native Android app (APK client)

JamRoom creates a shared “decision room” where teams can jam on ideas and vote live.

---

## 2. Problem Statement

Teams frequently need to make small, fast decisions:

- “Samosa, Kachori, or Burger?”
- “Which UI should we select?”
- “Which feature should be prioritized?”
- “Who wins the hackathon?”
- “What should we improve next sprint?”

Existing tools:
- Require internet
- Require login/signup
- Take time to configure
- Are too heavy for small internal decisions

There is a need for:
- Instant setup
- Same-Wi-Fi real-time voting
- No authentication
- No internet dependency
- Clear live results dashboard

---

## 3. Goals (Hackathon Scope)

- Build a local real-time voting system
- Support multiple devices on same Wi-Fi
- Provide live vote updates
- Support browser-based participation
- Provide Android APK client
- Deliver stable demo within 6 hours

---

## 4. Non-Goals (Strictly Out of Scope)

- No cloud deployment
- No database persistence
- No authentication system
- No user accounts
- No multi-session management
- No poll history
- No automatic network discovery
- No QR-based joining
- No vote editing after submission
- No advanced analytics

---

## 5. Final Architecture

### Host Machine (Laptop)

- Runs Node.js server
- Hosts:
  - Express HTTP server
  - WebSocket server (Socket.IO recommended)
  - Static web frontend
- Maintains in-memory session state
- Displays local IP address (e.g., http://192.168.1.50:3000)

### Participants

- Connect using:
  - Web browser (primary)
  - React Native Android app (secondary)
- Must be connected to same Wi-Fi network

No internet is required. Only local network communication.

---

## 6. User Roles

### 6.1 Host (Admin – Web Only)

Runs on laptop browser.

Capabilities:
- Create poll
- Start poll
- End poll
- View live results
- Reset poll

### 6.2 Participant (Web or App)

Capabilities:
- View active poll
- Vote once
- See live results

---

## 7. User Flow

### 7.1 Setup Flow

1. Host runs:
   node server.js
2. Server displays:
   http://192.168.x.x:3000
3. Participants open this URL in browser OR enter IP in mobile app.
4. Devices connect via WebSocket.

---

### 7.2 Poll Creation Flow (Host)

1. Enter poll question
2. Add 2–6 options
3. Click “Start Poll”
4. Poll becomes active for all connected clients

---

### 7.3 Voting Flow (Participant)

1. Poll question appears
2. User selects one option
3. Vote is submitted
4. User cannot vote again (v1 restriction)
5. Live results update instantly

---

### 7.4 Results Flow

- Bar-based visualization
- Vote count per option
- Percentage per option
- Highlight leading option
- Real-time updates via WebSocket

---

## 8. Core Features (MVP Only)

### 8.1 Server

- Express HTTP server
- Socket.IO for real-time communication
- In-memory state:
  - currentPoll
  - options
  - voteCounts
  - connectedClients
- Broadcast vote updates to all clients

### 8.2 Web Frontend

Minimal single-page interface:

Sections:
- Admin panel (visible on host device)
- Poll display
- Voting interface
- Live results board

### 8.3 React Native App

- Input field for Server IP
- Connect via Socket.IO
- Display active poll
- Submit vote
- Display live results

---

## 9. UI Screens

### Web

1. Home / Join Screen
2. Admin Panel
   - Question input
   - Option inputs
   - Start Poll button
3. Poll View
   - Question
   - Option buttons
4. Results View
   - Bar graph
   - Percentages

---

### React Native

1. Connect Screen
   - Input Server IP
   - Connect button
2. Poll Screen
   - Question
   - Option buttons
3. Results Screen
   - Vote counts
   - Percentages

---

## 10. Technical Stack

### Backend
- Node.js
- Express
- Socket.IO

### Web Frontend
- Vanilla JS or minimal React
- Socket.IO client

### Mobile
- React Native (CLI preferred)
- socket.io-client

---

## 11. Data Model (In-Memory)

currentPoll = {
  question: string,
  options: [
    { id: 1, text: string, votes: number }
  ],
  isActive: boolean
}

votes = {
  clientId: optionId
}

All data resets when server restarts.

---

## 12. Constraints

- Must work on same Wi-Fi
- Must support 5–20 devices
- Must be stable during demo
- No external services
- Session ends when server stops

---

## 13. Hackathon Scope Lock

Included:
- One active poll at a time
- Single vote per device
- Real-time updates
- Manual IP-based joining
- Web as primary interface

Excluded:
- Multi-poll management
- Poll history
- Named voting
- Vote editing
- Advanced UI polish
- Auto-discovery networking

---

## 14. Demo Plan

1. Start server
2. Share local IP with team
3. Everyone joins
4. Create poll:
   “Snacks Party – Samosa, Kachori, Burger?”
5. Everyone votes
6. Live results update
7. Declare winner
8. Optional second poll:
   “Hackathon Winner”

---

## 15. Success Criteria

JamRoom is successful if:

- Multiple devices connect
- Votes update instantly
- No crashes during demo
- Web and APK both function
- Team can make real decision using it

---

## 16. Future Enhancements (Post Hackathon)

- Poll history
- Anonymous vs named toggle
- Timer-based polls
- QR-based joining
- Auto network discovery
- Export results
- Persistent storage
- Role-based access
- Cloud deployment option

---

## 17. Product Positioning

JamRoom is a lightweight local decision room that enables teams to jam on ideas and vote live without relying on internet or external platforms.

It simplifies everyday collaborative decision-making inside office environments.
